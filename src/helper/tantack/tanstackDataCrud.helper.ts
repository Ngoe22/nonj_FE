import {createTranslator, useTranslations} from "next-intl";
import {QueryClient, useMutation, useQueryClient} from "@tanstack/react-query";
import type {CreateGroupFormValues} from "@/schemas/group/group.schema";
import {Group} from "@/types/group/group.type";
import {api} from "@/lib/axios/axios";
import {optimisticInfinityCreate, optimisticInfinityMode} from "@/helper/tantack/tanstack_InfinityDataOnAction.helper";
import {toast} from "react-toastify";



interface ConstructorProps {
    keysOfPages : string[]
    keysOfSingle : string[]
    endpoint : {
        createOne : string
        getOne : string
        updateOne : string
        deleteOne : string
        getMany : string
    }
}


interface Props {
    onMutate ?: {
        optimisticInfinityPages ?: optimisticInfinityMode ,
        optimisticInfinityOne ?: optimisticInfinityMode ,
        callback ?: () => void ,
    } ,
    onSuccess ?: {
        optimisticInfinityPages ?: optimisticInfinityMode ,
        optimisticInfinityOne ?: optimisticInfinityMode ,
        invalidatePages ?: boolean ,
        invalidateOne ?: boolean ,
        callback ?: () => void ,
    } ,
    onError ?: {
        callback ?: () => void ,
    } ,
    onSettled ?: {
        invalidatePages ?: boolean ,
        invalidateOne ?: boolean ,
    } ,

    additionPages ?: [ string[] ] ,
    additionOne ?: [ string[] ]
}







export class TanCrud  {
    private queryClient: QueryClient;
    private txt: ReturnType<typeof createTranslator>;
    private keysOfPages: string[];
    private keysOfSingle: string[];
    private endpoint: { createOne: string; getOne: string; updateOne: string; deleteOne: string; getMany: string };




    constructor( { keysOfPages , keysOfSingle , endpoint  } : ConstructorProps ) {
        this.txt = useTranslations('Toast');
        this.queryClient = useQueryClient();
        this.keysOfPages = keysOfPages;
        this.keysOfSingle = keysOfSingle;
        this.endpoint = endpoint;
    }


    async useGetPages() {


    }

    async useCreateOnInPages () {

    }

    async useUpdateOnInPages() {

        return
    }

    async useDeleteOnInPages() {

        return
    }


    async useCreateOne ({
    onMutate : {
        optimisticInfinityPages : optimisticInfinityMode ,
        optimisticInfinityOne : optimisticInfinityMode ,
        callback  ,
    }
    onSuccess : {
            optimisticInfinityPages : string ,
            optimisticInfinityOne : string ,
            invalidatePages : boolean ,
            invalidateOne : boolean ,
        callback
        } ,
        onError : {
            callback : function ,
        } ,
        onSettled : {
            invalidatePages : boolean ,
            invalidateOne : boolean ,
        } ,

        additionPages : [ [] ] ,
        additionOne : [ [] ]

    } : any) {


        const  allKeyOfPages = additionPages ?  [ ...this.keysOfPages , ...additionPages ] : this.keysOfPages
        const allKeyOfSingle  = additionOne ?  [ ...this.keysOfSingle , ...additionOne ] : this.keysOfSingle


        return useMutation({
            mutationFn: async (body): Promise<Group> => {
                const endpoint = this.endpoint.createOne

                const res = await api.post(endpoint, body);
                return res.data.data;
            },

            onMutate  : async () => {
                if (  onMutate.optimizepages   ) {
                    const pagesSnapshot await optimisticInfinityCreate(this.queryClient, [this.keysOfPages], body);
                    const pages =  { keys : this.keysOfPages , snapshot :pagesSnapshot }
                }

                if ( // optimize one same )


                    // luu y update co the la remove hoac update

                // goi call back neu true
                    return { pages  }

            } ,

            onSuccess: async (body) => {

                neu optiomaize true thi goi

                neu invalidate true thi goi


            },

            onError: (_err, _body, snapshot ) => {
                // lop snapshot co pages va single  , thuc hien roll back neu mutate optimize true



                if( onerror.callback ) onerror.callback(  )
            },

            onSettled: async () => {
                if ( isInvalidatePages ) {
                    await Promise.all(
                        this.keysOfPages.map((key) =>
                            this.queryClient.invalidateQueries({ queryKey: [key] }),
                        ),
                    );
                }
            },
        });
    }

    async useGetOne () {}

    async useUpdateOne () {}

    async useDeleteOne () {}


}