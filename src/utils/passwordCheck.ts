interface IOptions {
  password: string;
  name?: string;
  birthDate?: string;
  sequence?: boolean;
  equalityCharacter?: boolean;
  values?: string[];
  passwordLength?: number;
}

interface IResponse {
  code: number;
  valid: boolean;
  message: string;
}

export function strongPasswordValidation({
  password,
  birthDate,
  name,
  sequence,
  equalityCharacter,
  values,
  passwordLength,
}: IOptions): IResponse {
  let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]/;

  if (equalityCharacter) {
    regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])(?:([0-9a-zA-Z$*&@#])(?!\1))/;
  }

  const restRegex = passwordLength ? `{${passwordLength},}$` : `{12,}$`;

  regex = new RegExp(regex.source + restRegex);

  if (sequence) {
    const possibilities: string[] = [];

    for (let index = 0; index < password.length; index++) {
      const element = password[index];

      if (Number(element)) {
        const next = password[index + 1];

        if (Number(next) && Number(next) === Number(element) + 1) {
          possibilities.push('');
        }
      }
    }

    if (possibilities.length >= 2) {
      return {
        code: 1,
        valid: false,
        message: 'Senha contem pelo menos 2 sequências numéricas!',
      };
    }
  }

  if (name) {
    const values = name.split(' ');

    const possibilities: string[] = [];

    values.forEach((row) => {
      if (validateIfExists(row, password)) {
        possibilities.push('');
      }
    });

    if (possibilities.length > 0)
      return {
        code: 2,
        valid: false,
        message: 'Sua senha não pode conter dados pessoais!',
      };
  }

  if (birthDate) {
    const formatDates = birthDate.replaceAll('/', '-').split('-');

    const possibilities: string[] = [];

    formatDates.forEach((date) => {
      const valid = validateIfExists(date, password);

      if (valid) {
        possibilities.push('');
      }
    });

    if (possibilities.length > 0)
      return {
        code: 3,
        valid: false,
        message: 'Sua senha não pode conter dados pessoais!',
      };
  }

  if (values) {
    const valuesArray: string[] = [];

    values.forEach((word, index) => {
      const valid = validateIfExists(word, password);

      if (valid) {
        valuesArray.push(values[index]);
        return;
      }
    });

    if (valuesArray.length > 0) {
      return {
        code: 4,
        valid: false,
        message: `A palavra '${valuesArray[0]}' foi encontrada presente na senha`,
      };
    }
  }

  if (!regex.test(password)) {
    return {
      code: 5,
      valid: false,
      message: 'Senha não contem requisitos mínimos!',
    };
  }

  return {
    code: 0,
    valid: true,
    message: 'Senha forte!',
  };
}

function validateIfExists(param: string, password: string): boolean {
  if (password.toLowerCase().match(param.toLowerCase())) {
    return true;
  }

  return false;
}
