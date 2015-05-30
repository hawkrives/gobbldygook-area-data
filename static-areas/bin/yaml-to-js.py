# coding: utf-8
import re
import sys
import yaml
import string


def is_req_name(name):
    return re.match(r'^[A-Z0-9]', name)


def find_req_names(requirement):
    return [name for name in requirement.keys() if is_req_name(name)]


requirement_tmplt = string.Template('''function $func_title({courses, overrides}) {
    const c = partial(checkCoursesFor, courses)

    const override = checkOverridesFor(overrides, '$type', '$name', $accessor)
    const matches = [$courses]

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


def escape_js_func_name(string):
    return re.sub(r'[ \-]', '', string)


num_rex = re.compile(r'''
    (?P<dept>      [A-Za-z]{2,5}(/[A-Za-z]{2})? )  # course department
    (?P<num>       \d(\d|\*){2} )  # course number
    (?P<offcampus> [I] )?  # optional off-campus indicator
    (?P<section>   (?:\.)(\*|[A-Za-z]) )?  # course section
    (?P<year>      (?:\.)(\*|\d{4}) )?  # course year
    (?P<semester>  (?:\.)(\*|[1-5]) )?  # course semester
''', flags=re.VERBOSE)


def expand_course(deptnum):
    num_rex.match(deptnum)
    print(num_rex.groupdict)


def idents_to_js(lst):
    return 'aaasdads'


def make_template(requirement, key, parent):
    me = {
        'title': key,
        'conglomeration': parent['conglomeration'] + [key],
        'name': parent['name'],
        'type': parent['type'],
    }

    me['accessor'] = ', '.join(["'%s'" % part for part in me['conglomeration']])
    me['func_title'] = '_'.join([escape_js_func_name(part) for part in me['conglomeration']])

    if requirement['type'] == 'requirement':
        # stuff with courses
        print(requirement_tmplt.safe_substitute(me))

    elif requirement['type'] == 'requirement-set':
        # stuff with requirements
        requirements = [escape_js_func_name(req) for req in find_req_names(requirement)]
        # ['const $req_result = $req_func()' for req in reqs]
        me['req_results_defn'] = '\n'.join(['    const {0}_result = {1}_{0}()'.format(
                                                req,
                                                me['func_title'])
                                            for req in requirements])
        # [$req_result.result for req in reqs]
        me['req_results_results'] = idents_to_js(requirement['result'])
        # ',\n'.join([$req_result for req in reqs]),
        me['req_results_access'] = ',\n'.join(['            %s_result' % req
                                               for req in requirements])

        print(requirement_set_tmplt.safe_substitute(me))

    # print(requirement)
    # courses = expand_course()

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


def main():
    parse(sys.argv[1:])


if __name__ == '__main__':
    main()
