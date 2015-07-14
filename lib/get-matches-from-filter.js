import assertKeys from './assert-keys'

export default function getMatchesFromFilter(ctx) {
    assertKeys(ctx, 'filter')
    return ctx.filter._matches
}
