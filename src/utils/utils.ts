import * as bcrypt from 'bcrypt';

export const hashData = (data: string) => bcrypt.hash(data, 10);
