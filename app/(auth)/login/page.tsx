import LoginPageContent from "@/components/auth/LoginPageContent";

export default async function Login({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>;
}) {
    const { message } = await searchParams;
    return <LoginPageContent message={message} />;
}
