export const isEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const isPinValid = (pin) => typeof pin === "string" && pin.length === 8;
