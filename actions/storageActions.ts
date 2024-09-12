'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

function handleError(error) {
    if (error) {
        console.log(error);
    } else {
        throw error;
    }
}

export async function uploadFile(formData: FormData) {
    const supabase = await createServerSupabaseClient();

    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file found in formData');
    }

    try {
        const { data, error } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
            .upload(file.name, file, { upsert: true });

        if (error) {
            handleError(error);
        }

        return data;
    } catch (error) {
        console.error('File upload failed: ', error);
        throw new Error(`File upload error: ${error.message}`);
    }
}

export async function searchFiles(search: string = '') {
    const supabase = await createServerSupabaseClient();

    try {
        // 전체 파일 목록을 가져옵니다.
        const { data, error } = await supabase.storage.from(process.env.NEXT_PUBLIC_STORAGE_BUCKET).list();

        if (error) {
            handleError(error);
        }

        // 파일 타입만 필터링하고, 검색어에 해당하는 파일만 필터링
        const filteredData =
            data?.filter((file) => file.name.includes(search) && file.metadata && !file.metadata.is_folder) || [];

        return filteredData;
    } catch (error) {
        console.error('File search failed: ', error);
        throw new Error(`File search error: ${error?.message}`);
    }
}

export async function deleteFile(fileName: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase.storage.from(process.env.NEXT_PUBLIC_STORAGE_BUCKET).remove([fileName]);

        if (error) {
            handleError(error);
        }

        return data;
    } catch (error) {
        console.error('File delete failed: ', error);
        throw new Error(`File delete error: ${error?.message}`);
    }
}
