export const checkPassword = (pass) => {    
    let uppercase = new RegExp('(?=.*[A-Z])').test(pass);
    let lowercase = new RegExp('(?=.*[a-z])').test(pass);
    let numeric = new RegExp('(?=.*[0-9])').test(pass);
    let symbol = new RegExp('(?=.*[!@#$%^&*])').test(pass);

    // make sure the password is long enough
    let qualifyLength = pass.length >= 8;


    // to have a qualify password, it will need to meet all the criterias above
    let qualifyPassword = uppercase && lowercase && numeric && symbol && qualifyLength;

    // Uppercase letters: A-Z
    // Lowercase letters: a-z
    // Numbers: 0-9
    // Symbols: ~`!@#$%^&*()_-+={[}]|\:;"'<,>.?/

    return {
        uppercase,
        lowercase,
        numeric,
        symbol,
        checked: true,
        qualifyPassword,
        qualifyLength
    }
}