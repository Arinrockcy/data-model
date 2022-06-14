export default class status {
    constructor() {
        this._trigger = {
            refund: {
                filter: {
                    comparator: '!=',
                    value: 'deliverd, cancelled, shipped, cod'
                }
            }
        }
    }
}