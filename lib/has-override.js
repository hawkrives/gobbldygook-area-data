import has from 'lodash/object/has'
import pathToOverride from './path-to-override'

export default function hasOverride(path, overrides) {
    return has(overrides, pathToOverride(path))
}
