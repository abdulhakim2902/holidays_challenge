module.exports = () => {
    let stringNumber = ''

    while (stringNumber.length != 10) {
        let randomNumber = Math.floor(Math.random() * 10000000000);
        stringNumber = randomNumber.toString();
    }

    return stringNumber
}