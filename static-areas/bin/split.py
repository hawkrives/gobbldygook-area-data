# coding: utf-8
import re
import sys
import yaml

dept_rex = re.compile(r'[A-Za-z]{2,5}(/[A-Za-z]{2})?')
num_rex = re.compile(r'''
    \d(\d|\*){2}       # course number
    [I]?               # optional off-campus indicator
    (\.(\*|[A-Za-z]))? # course section
    (\.(\*|\d{4}))?    # course year
    (\.(\*|\d{1}))?    # course semester
''', flags=re.VERBOSE)


def is_dept(token):
    return dept_rex.match(token)


def is_num(token):
    return num_rex.match(token)


def to_number(token):
    # (all|any|none|zero|one|two|three)
    if token.lower() == 'all':
        return '$ALL'
    elif token.lower() == 'any':
        return '$ANY'
    elif token.lower() in ['none', 'zero']:
        return 0
    elif token.lower() == 'one':
        return 1
    elif token.lower() == 'two':
        return 2
    elif token.lower() == 'three':
        return 3
    elif token.lower() == 'four':
        return 4
    elif token.lower() == 'five':
        return 5
    elif token.lower() == 'six':
        return 6
    elif token.lower() == 'seven':
        return 7
    elif token.lower() == 'eight':
        return 8
    elif token.lower() == 'nine':
        return 9
    elif token.lower() == 'ten':
        return 10


def mongoize_operator(token):
    if token in ['&', '&&']:
        token = 'AND'
    elif token in ['|', '||']:
        token = 'OR'
    elif token in ['=', '==']:
        token = 'EQ'
    elif token == '<':
        token = 'LT'
    elif token == '>':
        token = 'GT'
    elif token == '<=':
        token = 'LTE'
    elif token == '>=':
        token = 'GTE'
    return '$' + token


where_pattern = r'''
    (?P<key_value> \w+ ) |
    (?P<operator> [<=>]{1,2} ) |
    (?P<whitespace> \s+ ) |
    (?P<eof> $ )
'''
where_scan = re.compile(pattern=where_pattern, flags=re.VERBOSE).finditer


def tokenize_where(clause):
    stack = [[]]

    # print(clause)
    for match in where_scan(clause):
        token_type = match.lastgroup
        token = match.group(0)
        # print(token_type, token)

        if token_type == 'key_value':
            stack[-1].append(token)

        elif token_type == 'operator':
            stack[-1].append(mongoize_operator(token))

        elif token_type == 'whitespace':
            pass

        elif token_type == 'eof':
            break

        else:
            raise Exception('Bad Input')

    tokenized = stack[0]
    return {
        'key': tokenized[0],
        'operator': tokenized[1],
        'value': tokenized[2],
    }


pattern = r'''
    (?P<open_paren> \( ) |
    (?P<close_paren> \) ) |
    (?P<open_brace> \{ ) |
    (?P<close_brace> \} ) |
    (?P<comma> \, ) |
    (?P<counter>
        (all|any|none|zero|one|two|three|four|five|six|seven|eight|nine|ten) ) |
    (?P<qualifier> (only\ )? courses\ where ) |
    (?P<countable> (credits | courses) ) |
    (?P<occurrence_expr> occurrences?\ of) |
    (?P<of_expr> of ) |
    (?P<where_expr> \w*\ ?([<=>]{1,2})\ ?\w* ) |
    (?P<identifier> [A-Za-z0-9.*/]+ ) |
    (?P<operator> (\&|\|){1,2} ) |
    (?P<whitespace> \s+ ) |
    (?P<eof> $ )
'''


def tokenize_result(text, requirement_names=[]):
    if requirement_names:
        rex_req_names = [re.escape(name) for name in requirement_names]
        this_pattern = '(?P<requirement> (' + ' | '.join(rex_req_names) + ')) |\n' + pattern
        # print(this_pattern)
    else:
        this_pattern = pattern

    stack = [[]]

    dept = ''
    for match in re.compile(pattern=this_pattern, flags=re.VERBOSE).finditer(text):
        token_type = match.lastgroup
        token = match.group(0)
        # print(match.groupdict())
        # print(token_type, token)

        if token_type == 'open_paren':
            stack.append([])

        elif token_type == 'close_paren':
            top = stack.pop()
            stack[-1].append(top)

        elif token_type == 'open_brace':
            stack.append([])

        elif token_type == 'close_brace':
            top = stack.pop()
            stack[-1].append(top)

        elif token_type == 'requirement':
            # print(token)
            stack[-1].append(token)

        elif token_type == 'identifier':
            if is_dept(token):
                dept = token

            elif is_num(token):
                stack[-1].append(dept + ' ' + token)

            else:
                stack[-1].append(token)

        elif token_type == 'comma':
            pass

        elif token_type == 'counter':
            stack[-1].append(to_number(token))

        elif token_type == 'countable':
            stack[-1].append(token)

        elif token_type == 'qualifier':
            stack[-1].append(token)

        elif token_type == 'of_expr':
            stack[-1].append(token)

        elif token_type == 'occurrence_expr':
            stack[-1].append(token)

        elif token_type == 'where_expr':
            stack[-1].append(tokenize_where(token))

        elif token_type == 'operator':
            token = mongoize_operator(token)
            stack[-1].append(token)

        elif token_type == 'whitespace':
            pass

        elif token_type == 'eof':
            break

        else:
            raise Exception('Bad Input')

    return stack[0]


def is_req_name(name):
    return re.match(r'^[A-Z]', name)


def find_req_names(requirement):
    return [name for name in requirement.keys() if is_req_name(name)]


def add_result(requirement, key):
    if type(requirement) is str and key != 'result':
        requirement = {'result': requirement}

    requirement.update({req: add_result(content, req)
                        for req, content in requirement.items()
                        if is_req_name(req)})

    for key in ['result', 'filter']:
        if key in requirement:
            requirement[key] = tokenize_result(requirement[key], find_req_names(requirement))

    return requirement


def test():
    inputs = [
        ['ten credits'],
        ['CHEM 398 && CS 250'],
        ['Algorithms & Ethics & Theory & Systems', ['Algorithms', 'Ethics', 'Theory', 'Systems']],
        ['CHEM 398 && (CS 250)'],
        ['CHEM 398 && (390 || CSCI 250)'],
        ['CS 121 && (CS 241 || (CS 289 && (CS 190)))'],
        ['one of (CS 121 && CS 241, CHEM 390)'],
        ['one of ( CHEM 398, 397, 390 )'],
        ['CHEM ${398} && 399'],
        ['CHEM 354 && (CS 657 || 432)'],
        ['one of ( CHEM 398, 397, 390 )'],
        ['three of (CHEM 271, 540, PSYCH 397, RUSSN 350, 360)'],
        ['three courses where { gereq=HWC }'],
        ['IST && SED && two courses', ['IST', 'SED']],
        ['one course where {gereq = EIN && year <= tyear}'],
        ['MATH 282.*.2014.1 | 244 | 252'],
        ['two of ( CSCI 315, 336, 300.*.2014.1, 350 )'],
        ['three occurrences of (THEAT 253)'],
    ]

    for req in inputs:
        print(req[0])
        print(tokenize_result(*req))


def parse(files):
    for file in sys.argv[1:]:
        with open(file, 'r') as infile:
            file = yaml.load(infile.read())

            [print('Warning: The requirement "%s" cannot begin with a lower-case letter' % k)
                for k in file.keys()
                if (not is_req_name(k) and
                    k not in ['title', 'type', 'revision', 'result'])]

            onlyReqs = {k: v
                        for k, v in sorted(file.items())
                        if is_req_name(k)}

            mapped = {req: add_result(content, req)
                      for req, content in onlyReqs.items()}

            requirement_names = find_req_names(file)
            file['result'] = tokenize_result(file['result'], requirement_names)

            file.update(mapped)

            print(yaml.dump(file))


def main():
    if len(sys.argv) > 1:
        parse(sys.argv[1:])
    else:
        test()


if __name__ == '__main__':
    main()
