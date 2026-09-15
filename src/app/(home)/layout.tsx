
import HomeLayout from "@/components/home/HomeLayout.compo";


export default function Layout(
    {children}: { children: React.ReactNode
}) {


  return (<HomeLayout>{children}</HomeLayout>);
}
