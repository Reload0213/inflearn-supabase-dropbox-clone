'use client';

import { useRef } from 'react';
import { Button } from '@material-tailwind/react';
import { uploadFile } from 'actions/storageActions';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'app/config/ReactQueryClientProvider';

export default function FileDragDropZone() {
    const fileRef = useRef(null);
    const uploadImageMutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['images'],
            });
        },
    });

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();

                const file = fileRef?.current?.files?.[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const result = await uploadImageMutation.mutate(formData);
                    console.log(result);
                }
            }}
            className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center"
        >
            <input ref={fileRef} type="file" className="" />
            <p>파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
            <Button type="submit">파일 업로드</Button>
        </form>
    );
}
