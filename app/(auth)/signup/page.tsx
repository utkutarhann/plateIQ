import { SignupForm } from "@/components/auth/SignupForm";


export default async function Signup({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>;
}) {
    const { message } = await searchParams;
    return (
        <>

            <SignupForm message={message} />
        </>
    );
}

