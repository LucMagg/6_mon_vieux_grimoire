const bestRatedBooks = (books) => {
    books.sort( (a, b) => { return b.averageRating - a.averageRating })
    let sliceToReturn = 0
    books.length > 2 ?
        sliceToReturn = 3 :
        sliceToReturn = books.length
    return books.slice(0, sliceToReturn)
}

const upperLower = (str) => {
    const chars = [' ', '-', '&'];
    let toReturn = str.substring(0,1).toUpperCase()

    for (let i = 1; i <= str.length; i++) {
        let someMatch = false
        chars.forEach(char => {
            if ((str.substring(i, i + 1).includes(char)) && (i + 2 <= str.length)) {
                toReturn += char + str.substring(i + 1, i + 2).toUpperCase()
                someMatch = true
                i++
            }
        })
        if (!someMatch) {
            toReturn += str.substring(i, i + 1).toLowerCase()
        }
    }

    return toReturn
}


module.exports = { bestRatedBooks, upperLower }