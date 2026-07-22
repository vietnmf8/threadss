import * as z from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().min(1).email(),
});

export default forgotPasswordSchema;
