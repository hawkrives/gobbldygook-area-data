# coding: utf-8
import re
import sys
import yaml
from string import Template

dept_rex = re.compile(r'[A-Za-z]{2,5}(/[A-Za-z]{2})?')
num_rex = re.compile(r'''
    (\ ?(?P<num>       \d(\d|\*){2} ))  # course number
    (\ ?(?P<offcampus> [I] ))?  # optional off-campus indicator
    (\ ?\.(?P<section>   (\*|[A-Za-z]) ))?  # course section
    (\ ?\.(?P<year>      (\*|\d{4}) ))?  # course year
    (\ ?\.(?P<semester>  (\*|[1-5]) ))?  # course semester
''', flags=re.VERBOSE)

deptnum_regex = re.compile(r'''
    (?P<dept>      [A-Za-z]{2,5}(/[A-Za-z]{2})? )  # course department
    (\ ?(?P<num>       \d(\d|\*){2} ))  # course number
    (\ ?(?P<offcampus> [I] ))?  # optional off-campus indicator
    (\ ?\.(?P<section>   (\*|[A-Za-z]) ))?  # course section
    (\ ?\.(?P<year>      (\*|\d{4}) ))?  # course year
    (\ ?\.(?P<semester>  (\*|[1-5]) ))?  # course semester
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
        token = 'and'
    elif token in ['|', '||']:
        token = 'or'
    elif token in ['=', '==']:
        token = 'eq'
    elif token == '<':
        token = 'lt'
    elif token == '>':
        token = 'gt'
    elif token == '<=':
        token = 'lte'
    elif token == '>=':
        token = 'gte'
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


def begin_level(stack, level):
    stack.append([])
    level += 1


def end_level(stack, level):
    top = stack.pop()
    (stack[-1] if len(stack) else stack).append(top)
    level -= 1


pattern = r'''
    (?P<open_paren> \( ) |
    (?P<close_paren> \) ) |
    (?P<open_brace> \{ ) |
    (?P<close_brace> \} ) |
    (?P<comma> \, ) |
    (?P<counter>
        (all|any|none|zero|one|two|three|four|five|six|seven|eight|nine|ten) ) |
    # (?P<qualifier> (only\ )? courses\ where ) |
    # (?P<countable> (credits | courses) ) |
    # (?P<occurrence_expr> occurrences?\ of) |
    # (?P<of_expr> of ) |
    # (?P<where_expr> \w*\ ?([<=>]{1,2})\ ?\w* ) |
    (?P<identifier> [A-Za-z0-9.*/]+ ) |
    (?P<operator> (\&|\|){1,2} ) |
    (?P<whitespace> \s+ ) |
    (?P<eof> $ )
'''


pattern = r'''
    (?P<open_paren> \( ) |
    (?P<close_paren> \) ) |

    (?P<course>
        # department
        (?P<c_dept> [A-Z]{2,5}(?:/[A-Z]{2})?(?:\s?) ) ?
        # number
        (?P<c_number> \d(?:\d|X){2}(?:I?) )
        # rest of info
        (?P<c_info>
                    \.(?P<c_section>  [A-Z*]     )
            (?:     \.(?P<c_year>     \d{4} | \* )
                (?: \.(?P<c_semester> [1-5*]     )  )? )?  )?
    ) |

    (?P<counter_number>
        x(?:(?:s(?:even|ix)|f(?:our|if)|nine)te|e(?:ighte|lev))en|t(?:(?:hirte)?en|welve) |
        (?:f(?:ive|our)|s(?:even|ix)|t(?:hree|wo)|(?:ni|o)ne|eight) |
        (?:zero|none|a(ny|ll))
        (?=(?:\ of|\ from|\ where|\ occurrence|\ course|\ credit|\ department)) ) |

    (?P<counter>
        \s+(?:
            (?: course | credit | department )(?:s)? |
            occurrence(?:s)?\s+of\s+(?P=course)
        )
        (?=(?:\ of|\ from|\ where|\ occurrence|\ course|\ credit|\ department)) ) |
    ) |

    (?P<reqname> (?: [A-Z][a-z\s]* (?: \s \( (?:[A-Z])+ \) )? ) ) |

    (?P<expression> (?: (?P=reqname) | (?P=course) | (?P=counter) | (?P=of) | (?P=where) ) ) |

    (?P<operator> [&|!] ) |
    (?P<boolean> (?: != | <= | => | < | > | = ) ) |

    (?P<expression_list> (?: (?P=expression) | (?P=operator) ) ) |

    (?P<list> \( ((?:(?P=expression)\,\s?)+) \) ) |

    (?P<of> of \s+ (?P=list) ) |

    (?P<where>
        (?:(?P=counter))
        \s from \s courses \s where
        \{ [a-z]+\s* (?P=boolean) ([a-z]+ | (?P=where)) \} ) |

    # (?P<whitespace> \s+ ) |
    # (?P<eof> $ )
'''

course = Template(r'''
(?:
    # department
    (?: [A-Z]{2,5}(?:/[A-Z]{2})?(?:\s?) ) ?
    # number
    (?: \d(?:\d|X){2}(?:I?) )
    # rest of info
    (?:
                \.(?:  [A-Z*]     )
        (?:     \.(?:     \d{4} | \* )
            (?: \.(?: [1-5*]     )  )? )?  )? )
''').safe_substitute()

counter_number = Template(r'''
(?:
    (?:(?:s(?:even|ix)|f(?:our|if)|nine)te|e(?:ighte|lev))en|t(?:(?:hirte)?en|welve) |
    (?:f(?:ive|our)|s(?:even|ix)|t(?:hree|wo)|(?:ni|o)ne|eight) |
    (?:zero|none|a(ny|ll)) )
''').safe_substitute()

counter = Template(r'''
(?:
    ${counter_number}
    \s+(?:
        (?: course | credit | department )(?:s)? |
        occurrence(?:s)? \s+ of \s+ ${course}
    ) )
''').safe_substitute({
    'counter_number': counter_number,
})

reqname = Template(r'''
(?: [A-Z][a-z\s]* (?: \s \( (?:[A-Z])+ \) )? )
''').safe_substitute()

of = Template(r'''
(?: of \s+ (?=\(.*\) ) )
''').safe_substitute()

boolean = Template(r'''
(?: != | <= | => | < | > | = )
''').safe_substitute()

where = Template(r'''
(?:
    (?: ${counter_number} | ${counter} \s from )
    \s course(?:s)? \s where
    \{ [a-z]+\s* ${boolean} [a-z]+ \} )
''').safe_substitute({
    'counter_number': counter_number,
    'counter': counter,
    'boolean': boolean,
})

expression = Template(r'''
(?:
    ${reqname} | ${course} | ${counter} | ${of} | ${where} )
''').safe_substitute({
    'reqname': reqname,
    'course': course,
    'counter': counter,
    'of': of,
    'where': where,
})

operator = Template(r'''
(?:
    [&|!] )
''').safe_substitute()

expression_list = Template(r'''
(?:
    ${expression} | ${operator} )
''').safe_substitute({
    'expression': expression,
    'operator': operator,
})

list = Template(r'''
(?:
    \( ((?: ${expression} \,\s?)+) \) )
''').safe_substitute({
    'expression': expression,
})

    # (?P<course> ${course} ) |
    # (?P<counter_number> ${counter_number} ) |
    # (?P<counter> ${counter} ) |
    # (?P<reqname> ${reqname} ) |
    # (?P<expression> ${expression} ) |
    # (?P<operator> ${operator} ) |
    # (?P<boolean> ${boolean} ) |
    # (?P<expression_list> ${expression_list} ) |
    # (?P<list> ${list} ) |
    # (?P<of> ${of} ) |
pattern2 = Template(r'''
    (?P<open_paren> \( ) |
    (?P<close_paren> \) ) |

    (?P<where> ${where} )
''').safe_substitute({
    'course': course,
    'counter_number': counter_number,
    'counter': counter,
    'reqname': reqname,
    'expression': expression,
    'operator': operator,
    'boolean': boolean,
    'expression_list': expression_list,
    'list': list,
    'of': of,
    'where': where,
})

# print(course)
# print(counter_number)
# print(counter)
# print(reqname)
# print(expression)
# print(operator)
# print(boolean)
# print(expression_list)
# print(list)
# print(of)
# print(where)
print(pattern2)


def tokenize_result(text, requirement_names=[]):
    if requirement_names:
        rex_req_names = [re.escape(name) for name in requirement_names]
        this_pattern = '(?P<requirement> (' + ' | '.join(rex_req_names) + ')) |\n' + pattern
        # print(this_pattern)
    else:
        this_pattern = pattern

    stack = [[]]

    dept = ''
    level = 0
    for match in re.compile(pattern=this_pattern, flags=re.VERBOSE).finditer(text):
        token_type = match.lastgroup
        token = match.group(0)
        # print(token_type, token)

        if token_type in ['open_paren', 'open_brace']:
            begin_level(stack, level)

        elif token_type in ['close_paren', 'close_brace']:
            end_level(stack, level)

        elif token_type == 'requirement':
            stack[-1].append(token)

        elif token_type == 'identifier':
            if is_dept(token):
                dept = token

            elif is_num(token):
                stack[-1].append(dept + ' ' + token)

            else:
                stack[-1].append(token)

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
            stack[-1].append(mongoize_operator(token))

        elif token_type in ['comma', 'whitespace']:
            pass

        elif token_type == 'eof':
            break

        else:
            raise Exception('Bad Input')

    return stack[0]


inputs = [
    ['CS 121 | 125'],
    # [CS, 121, '|', 125],
    ['MATH 282.*.2014.1 | 244 | 252'],
    # [MATH, 282, ., *, ., 2014, ., 1, '|', 244, '|', 252],
    ['ART 150 & 151'],
    ['CHEM 398 && 399'],
    ['CHEM 354 && (CS 657 || 432)'],
    ['CHEM 398 & (CS 250)'],
    ['CHEM 398 & (390 | CSCI 250)'],
    ['CS 121 && (CS 241 || (CS 289 && (CS 190)))'],
    ['Algorithms & Ethics & Theory & Systems', ['Algorithms', 'Ethics', 'Theory', 'Systems']],
    ['Five & ( European | North American ) & ( Asian | African | Latin American )',
        ['Five', 'European', 'North American', 'Asian', 'African', 'Latin American']],

    ['one of (CS 121 && CS 241, CHEM 390)'],
    ['one of ( CHEM 398, 397, 390 )'],
    ['two of ( CSCI 315, 336, 300.*.2014.1, 350 )'],
    ['three of (CHEM 271, 540, PSYCH 397, RUSSN 350, 360)'],
    ['one of (ART 101, 102, (CHEM 103 | 130))'],

    ['three courses where { gereq=HWC }'],
    ['one credit where {gereqs = FYW & (year = (1650 | 1670) | semester > 0)}'],

    ['two occurrences of ART 101B'],
    ['three occurrences of (THEAT 253)'],

    ['two courses & two departments & SED & IST', ['SED', 'IST']],
    ['(two courses & two departments) & (SED & IST)', ['SED', 'IST']],

    ['one course where {gereqs = EIN & year <= max (year) from courses where {gereqs=BTS-T}}']

    # ['two courses & one course where {dept=MATH}',
    #    {filter: 'only (MATH 330, 340, 344, 348, 351, 396, 398, STAT 322, CSCI 315, CSCI 333)'}],

    # ['''
    # CS 121 & one of (
    #     ART 101,
    #     (
    #         (CHEM 301.B & 302.B) |
    #         (CSCI 251 & 252.*.2014.3) |
    #         two of (ASIAN 130, 230, 399)
    #     ),
    #     one course where {gereq = EIN},
    # ) &
    # (
    #     two occurrences of THEAT 235 &
    #     ten credits from courses where {department = ART}
    # )
    # ''']
]

# for req in inputs:
#     print(req[0])
#     print(tokenize_result(*req))
