'use client';

import { useState, useEffect } from 'react';
import { IconButton, Spinner } from '@material-tailwind/react';
import { getImageUrl } from 'utils/supabase/storage';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'app/config/ReactQueryClientProvider';
import { deleteFile } from 'actions/storageActions';

export default function DropboxImage({ image }) {
    const deleteFileMutation = useMutation({
        mutationFn: deleteFile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['images'],
            });
        },
    });

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImageUrl() {
            const url = await getImageUrl(image.name);
            setImageUrl(url);
        }

        fetchImageUrl();
    }, [image.name]);

    return (
        <div className="relative w-full flex flex-col gap-2 p-4 border border-gray-100 rounded-2xl shadow-md">
            {/* Image */}
            <div>
                <img src={imageUrl || ''} className="w-full aspect-square rounded-2xl" />
            </div>

            {/* FileName */}
            <div className="">{image.name}</div>

            <div className="absolute top-4 right-4">
                <IconButton
                    onClick={() => {
                        deleteFileMutation.mutate(image.name);
                    }}
                    color="red"
                >
                    {deleteFileMutation.isPending ? <Spinner /> : <i className="fas fa-trash" />}
                </IconButton>
            </div>
        </div>
    );
}
