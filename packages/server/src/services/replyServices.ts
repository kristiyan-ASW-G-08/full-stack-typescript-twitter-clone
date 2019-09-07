import Reply from '@models/Reply';
import ReplyType from '@customTypes/Reply';
import ValidationError from '@twtr/common/source/types/ValidationError';
import { CustomError, errors } from '@utilities/CustomError';

export const getReplyById = async (
  replyId: string,
): Promise<{ reply: ReplyType }> => {
  const reply = await Reply.findById(replyId);
  if (!reply) {
    const validationErrorsArr: ValidationError[] = [
      {
        name: '',
        message: 'reply does not exist',
      },
    ];
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
  return { reply };
};

export default getReplyById;
