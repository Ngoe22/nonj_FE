import HomeLayout from "@/components/home/HomeLayout.compo";
import LanguageSelector from "@/components/_share/language_model/LanguageSelector.compo";
import { ToastContainer } from "react-toastify";
import { AuthBootstrap } from "@/providers/auth-bootsrap";

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ToastContainer />
            <AuthBootstrap>
                <HomeLayout>
                    {children}
                    <LanguageSelector />
                </HomeLayout>
            </AuthBootstrap>
        </>
    );
}