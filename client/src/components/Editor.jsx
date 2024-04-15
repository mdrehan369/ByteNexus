import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from "react-hook-form"
import Spinner from './Spinner';

export default function App({ control, name, defaultValue }) {

    const [loader, setLoader] = useState(true);

    return (
        <>
            {loader && <Spinner className='w-[100%] h-full' />}
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey='bf61ya5i6apwdxddvhy41mf4deabaze3ac4lzk3c9b9drk4p'
                        onInit={() => setLoader(false)}
                        init={{
                            initialValue: { defaultValue },
                            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                            tinycomments_mode: 'embedded',
                            tinycomments_author: 'Author name',
                            mergetags_list: [
                                { value: 'First.Name', title: 'First Name' },
                                { value: 'Email', title: 'Email' },
                            ],
                            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                            branding: false,
                            skin: "oxide-dark",
                            width: "65vw",
                            height: "85vh",
                            icons: "material",
                            resize: false,
                        }}
                        initialValue={defaultValue}
                        onEditorChange={onChange}
                    />
                )}
            />
        </>
    );
}