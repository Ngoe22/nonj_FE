import HomeLayout from "@/components/home/HomeLayout.compo";
import LanguageSelector from "@/components/_share/language_model/LanguageSelector.compo";
import {ToastContainer} from "react-toastify";
import UserInfo from "@/components/_share/user_info/UserInfo.compo";
import UserDetailModal from "@/components/_share/user_info/UserDetailModal.compo";



export default function Layout({children,}: { children: React.ReactNode }) {
    return (
        <>
                <HomeLayout>
                    {children}
                    <LanguageSelector />
                    <UserDetailModal />
                </HomeLayout>
        </>
    );
}