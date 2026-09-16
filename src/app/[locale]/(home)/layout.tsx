
import HomeLayout from "@/components/home/HomeLayout.compo";
import {useUserProfile} from "@/hooks/home/useUserProfile.hook";
import LanguageSelector from "@/components/_share/language_model/LanguageSelector.compo";


export default function Layout(
    {children}: { children: React.ReactNode
}) {

  // const user =  useUserProfile()
  return (
      <HomeLayout>
          {children}
          <LanguageSelector/>

      </HomeLayout>);
}
