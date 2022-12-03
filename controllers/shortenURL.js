const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

function shortenURL(number){
  let result = ''
   for (let i = 0; i < number; i++){
     const index = Math.floor(Math.random() * letters.length)
     const letter = letters[index]
     result += letter
   }
   return result
}

module.exports = shortenURL