export interface Letter {
    symbol: string,
    index?: number
}

export interface MetaLetter extends Letter {
    enabled: boolean,
    alreadyPlayed: boolean
}
