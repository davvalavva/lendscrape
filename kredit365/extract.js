module.exports = async function () {
    const result = await frame.evaluate(() => {
        const myElements = document.querySelectorAll('.bar')
        Array.from(myElements).forEach(doSomethingWithEachElement)
        // return something
    });
    return result
};