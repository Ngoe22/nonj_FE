
import HomeLayout from "@/components/home/HomeLayout.compo";
import {useUserProfile} from "@/hooks/home/useUserProfile.hook";


export default function Layout(
    {children}: { children: React.ReactNode
}) {

  // const user =  useUserProfile()
  return (<HomeLayout>{children}</HomeLayout>);
}
