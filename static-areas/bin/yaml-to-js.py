# coding: utf-8
import re
import sys
import json
import yaml
import string


def is_req_name(name):
    return re.match(r'^[A-Z0-9]', name)


def find_req_names(requirement):
    return [name for name in requirement.keys() if is_req_name(name)]


requirement_tmplt = string.Template('''function $func_title({courses, overrides}) {
    const c = partial(checkCoursesFor, courses)

    const override = checkOverridesFor(overrides, '$type', '$name', $accessor)
    const matches = [$results]

    let result = false
    if (!override) {
        const results = map(matches, (m) => Boolean(size(m)))
        result = $matches
    }

    return {
        title: '$title',
        description: '$description',
        result: override || result,
        overridden: override,
        matches: matches,
    }
}''')

requirement_set_tmplt = string.Template('''function $func_title({courses, overrides}) {
$req_results_defn

    const result = $req_results_results
    const override = checkOverridesFor(overrides, '$type', '$name', $accessor)

    return {
        title: '$title',
        description: '$description',
        result: override || result,
        overridden: override,
        requirements: [
$req_results_access
        ]
    }
}''')


def safe_js_ident(string):
    return re.sub(r'[ \-]', '', string)


deptnum_regex = re.compile(r'''
    (?P<dept>      [A-Za-z]{2,5}(/[A-Za-z]{2})? )  # course department
    (\ ?(?P<num>       \d(\d|\*){2} ))  # course number
    (\ ?(?P<offcampus> [I] ))?  # optional off-campus indicator
    (\ ?\.(?P<section>   (\*|[A-Za-z]) ))?  # course section
    (\ ?\.(?P<year>      (\*|\d{4}) ))?  # course year
    (\ ?\.(?P<semester>  (\*|[1-5]) ))?  # course semester
''', flags=re.VERBOSE)

is_num = re.compile(r'\d+$').match


def expand_course(deptnum):
    m = deptnum_regex.match(deptnum)
    truthy = {k: v for k, v in m.groupdict().items() if v}
    typed = {k: int(v) if is_num(v) else v for k, v in truthy.items()}
    return typed


def demongoize_operator(token):
    if token == '$AND':
        return '&&'
    elif token == '$OR':
        return '||'
    elif token == '$EQ':
        return '=='
    elif token == '$LT':
        return '<'
    elif token == '$GT':
        return '>'
    elif token == '$LTE':
        return '<='
    elif token == '$GTE':
        return '>='
    else:
        return token


def process_item_for_results(item):
    if type(item) == str:
        if item[0] == '$':
            return demongoize_operator(item)
        elif deptnum_regex.match(item):
            course = expand_course(item)
            return 'c(' + json.dumps(course) + ')'


def process_item_for_matches(item, template):
    item_type = type(item)
    if item_type == str:
        if item[0] == '$':
            return None
        elif deptnum_regex.match(item):
            course = expand_course(item)
            return template % json.dumps(course)
    elif item_type == int:
        return None
    elif item_type == list:
        return [process_item_for_matches(i, template) for i in item]


def expand_results(lst, matches):
    # print('expand_results', lst)
    # results[0] || results[1]
    processed = []
    operator_count = 0
    for i, item in enumerate(matches):
        if not item:
            processed.append(demongoize_operator(lst[i]))
            operator_count += 1
        else:
            processed.append('results[%d]' % (i - operator_count))

    return (processed, ' '.join(processed))


def expand_matches(lst, template='c(%s)'):
    # [c({dept: 'CSCI', num: 121}), c({dept: 'CSCI', num: 125})]
    processed = [process_item_for_matches(item, template) for item in lst]
    flattened = list(flatten(processed))
    return (flattened, ', '.join([item for item in flattened if item]))


def flatten(l):
    # from http://stackoverflow.com/a/2158532/2347774
    for el in l:
        if isinstance(el, list) and not isinstance(el, str):
            yield from flatten(el)
        else:
            yield el


def make_template(requirement, key, parent):
    me = {
        'title': key,
        'conglomeration': parent['conglomeration'] + [key],
        'name': parent['name'],
        'type': parent['type'],
    }

    me['accessor'] = ', '.join(["'%s'" % part for part in me['conglomeration']])
    me['func_title'] = '_'.join([safe_js_ident(part) for part in me['conglomeration']])

    result_list = requirement['result']

    if requirement['type'] == 'requirement':
        # stuff with courses
        me['results'] = expand_matches(result_list)
        me['matches'] = expand_results(result_list, me['results'])
        print(requirement_tmplt.safe_substitute(me))

    elif requirement['type'] == 'requirement-set':
        # stuff with requirements
        requirements = [safe_js_ident(req) for req in find_req_names(requirement)]

        # ['const $req_result = $req_func()' for req in reqs]
        me['req_results_defn'] = '\n'.join(['    const {0}_result = {1}_{0}()'.format(
                                            req, me['func_title'])
                                            for req in requirements])

        # [$req_result.result for req in reqs]
        me['req_results_results'] = expand_matches(result_list, template='%s.result')

        # ',\n'.join([$req_result for req in reqs]),
        me['req_results_access'] = ',\n'.join(['            %s_result' % req
                                               for req in requirements])

        print(requirement_set_tmplt.safe_substitute(me))

    # print(requirement)
    # expand_course('CH/BI 125')

    # [make_template(requirement[req], req, me)
    #     for req in requirement
    #     if is_req_name(req)]

    return requirement


export_tmplt = string.Template('''export default {
    title: '$title',
    revision: '$revision',
    type: '$type',
    check: _check,
}''')


def parse(files):
    for file in sys.argv[1:]:
        with open(file, 'r') as infile:
            file = yaml.load(infile.read())
            title = file['title']
            type = file['type']

            onlyReqs = {key: value
                        for key, value in sorted(file.items())
                        if is_req_name(key)}

            me = {
                'name': title,
                'type': type,
                'conglomeration': []
            }

            print('import {partial, map} from \'lodash\'')

            mapped = {key: make_template(requirement, key, me)
                      for key, requirement in onlyReqs.items()}

            print(export_tmplt.safe_substitute(file))

            # file.update(mapped)

            # print(yaml.dump(file))


def test():
    res_list = ['CSCI 273', '$OR', 'CSCI 284', '$OR', 'CSCI 300.*.2014.2', '$OR', 'CSCI 300.*.2012.3']

    print('\nmatches')
    matches, match_str = expand_matches(res_list)
    print(matches, '\n', match_str)

    print('\nresults')
    results, result_str = expand_results(res_list, matches)
    print(results, '\n', result_str)

    res_list_2 = [2, 'of', [['CSCI 273', '$OR', 'CSCI 284'], 'CSCI 300.A']]

    print('\nmatches')
    matches, match_str = expand_matches(res_list_2)
    print(matches, '\n', match_str)

    print('\nresults')
    results, result_str = expand_results(res_list_2, matches)
    print(results, '\n', result_str)


def main():
    if len(sys.argv) > 1:
        parse(sys.argv[1:])
    else:
        test()


if __name__ == '__main__':
    main()
