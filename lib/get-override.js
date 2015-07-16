import pathToOverride from './path-to-override'

export default function getOverride(path, overrides) {
    return overrides[pathToOverride(path)]
}
