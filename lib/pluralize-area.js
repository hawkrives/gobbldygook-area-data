export default function pluralizeArea(type) {
    type = type.toLowerCase()
    if (type === 'emphasis') {
        return 'emphases'
    }
    else {
        return type + 's'
    }
}
