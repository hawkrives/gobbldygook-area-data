export default function isRequirementName(name) {
    return /^[A-Z0-9][A-Za-z0-9_\- /]*/.test(name)
}
