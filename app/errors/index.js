const CODES = {
	UNKNOWN_ERROR: 0,
	NOT_FOUND: 1,
	NOT_CORRECT_QUERY: 2,
	BAD_PASSWORD_OR_LOGIN: 4,
};

const messages = {
	[CODES.UNKNOWN_ERROR]: {
		status: 500,
		message: `Неизвестная ошибка`,
	},
	[CODES.NOT_FOUND]: {
		status: 404,
		message: `Ничего не найдено`,
	},
	[CODES.NOT_CORRECT_QUERY]: {
		status: 400,
		message: `Некорректный запрос`,
	},
	[CODES.BAD_PASSWORD_OR_LOGIN]: {
		status: 400,
		message: `Проверьте корректность логина или пароля`,
	},
};

class Errors extends Error {
	constructor(code = 9000, ...params) {
		super();
		
		this.code = code;
		this.status = messages[code].status;
		this.message = typeof messages[code].message === 'function' ? messages[code].message(...params) : messages[code].message;
		
		return this;
	}
	
	static get CODES() {
		return CODES;
	}
}

module.exports = Errors;