<script>
    // your script goes here
    import Dropzone from 'svelte-file-dropzone';

    import { setLoadingStatus, setErrorStatus, setChatModeStatus } from '../../store'
    import { uploadPDF } from '../../services/index'

    let files = {
        accepted: [],
        rejected: []
    };

    async function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];

        if (files.accepted.length > 0) {
            setLoadingStatus()
            try {
                const pdf = files.accepted[0];

                const data = await uploadPDF(pdf)

                setChatModeStatus(data)

            } catch (error) {
                console.error(error)
                setErrorStatus()
            }
        }
    }
</script>

<!-- markup (zero or more items) goes here -->
<Dropzone
    containerClasses="bg-gray-300 text-black dark:bg-gray-100 dark:text-gray-500"
    accept="application/pdf"
    multiple={false} 
    on:drop={handleFilesSelect}
>
    Drag your pdf here
</Dropzone>
