import React, { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import MovieIcon from "@mui/icons-material/Movie";

import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import { uploadDocuments } from "../services/api";


const UploadCard = ({ onUploadSuccess }) => {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);


  // File Drop Handler
  const onDrop = (acceptedFiles, rejectedFiles) => {

    console.log("Accepted Files:", acceptedFiles);
    console.log("Rejected Files:", rejectedFiles);


    if (rejectedFiles.length > 0) {
      toast.error("Some files are not supported");
    }


    if (acceptedFiles.length === 0) {
      toast.error("No valid files selected");
      return;
    }


    setFiles(acceptedFiles);
  };


  const {
    getRootProps,
    getInputProps,
    isDragActive

  } = useDropzone({

    onDrop,

    multiple:true,

    accept:{

      "application/pdf":[
        ".pdf"
      ],

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":[
        ".docx"
      ],

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":[
        ".xlsx"
      ],

      "audio/*":[
        ".mp3",
        ".wav",
        ".m4a",
        ".aac"
      ],

      "video/*":[
        ".mp4",
        ".avi",
        ".mov",
        ".mkv"
      ]

    }

  });



  // Remove Selected File
  const removeFile=(index)=>{

    setFiles(
      previous =>
      previous.filter(
        (_,i)=>i!==index
      )
    );

  };



  // Upload Function
  const upload = async()=>{


    if(files.length===0){

      toast.error(
        "Please select files"
      );

      return;
    }


    try{


      setLoading(true);
      setProgress(0);



      const formData = new FormData();



      files.forEach((file)=>{

        formData.append(
          "files",
          file
        );

      });



      console.log(
        "Uploading Files"
      );


      for(let pair of formData.entries()){

        console.log(
          pair[0],
          pair[1].name
        );

      }



      const response =
      await uploadDocuments(

        formData,

        (percent)=>{

          setProgress(percent);

        }

      );



      toast.success(
        "Files uploaded successfully"
      );



      if(onUploadSuccess){

        onUploadSuccess(response);

      }



      setFiles([]);

      setProgress(100);



    }

    catch(error){


      console.error(
        "Upload Error:",
        error.response?.data ||
        error.message
      );



      toast.error(

        error.response?.data?.message ||
        "Upload failed"

      );


    }

    finally{

      setLoading(false);

    }

  };





  // File Icons
  const fileIcon=(fileName)=>{


    const file =
    fileName.toLowerCase();



    if(file.endsWith(".pdf"))

      return <PictureAsPdfIcon color="error"/>;



    if(file.endsWith(".docx"))

      return <DescriptionIcon color="primary"/>;



    if(
      file.endsWith(".xls") ||
      file.endsWith(".xlsx")
    )

      return <TableChartIcon color="success"/>;




    if(
      file.endsWith(".mp3") ||
      file.endsWith(".wav") ||
      file.endsWith(".aac") ||
      file.endsWith(".m4a")
    )

      return <AudioFileIcon color="secondary"/>;




    if(
      file.endsWith(".mp4") ||
      file.endsWith(".avi") ||
      file.endsWith(".mov") ||
      file.endsWith(".mkv")
    )

      return <MovieIcon color="warning"/>;



    return <DescriptionIcon/>;

  };





return (

<Card
 elevation={6}
 sx={{
   borderRadius:4
 }}
>


<CardContent>



<Typography
variant="h6"
fontWeight="bold"
>
Upload Files
</Typography>



<Typography
variant="body2"
color="text.secondary"
>
PDF • Word • Excel • Audio • Video
</Typography>



<Divider
sx={{
 my:2
}}
/>





<Box

{...getRootProps()}

sx={{

border:"2px dashed #1976d2",

borderRadius:3,

p:4,

textAlign:"center",

cursor:"pointer",

backgroundColor:

isDragActive
?
"#E3F2FD"
:
"#FAFAFA"

}}

>


<input {...getInputProps()}/>




<CloudUploadIcon

sx={{

fontSize:60,

color:"#1976d2"

}}

/>



<Typography
fontWeight="bold"
mt={2}
>
Drag & Drop Files
</Typography>



<Typography
variant="body2"
color="text.secondary"
>
or click to browse
</Typography>




<Stack

direction="row"

spacing={1}

mt={2}

justifyContent="center"

flexWrap="wrap"

>


<Chip label="PDF"/>

<Chip label="DOCX"/>

<Chip label="XLSX"/>

<Chip label="MP3"/>

<Chip label="WAV"/>

<Chip label="MP4"/>

<Chip label="AVI"/>

<Chip label="MOV"/>

<Chip label="MKV"/>


</Stack>


</Box>





{
files.length>0 &&

<>

<Typography

mt={3}

mb={1}

fontWeight="bold"

>

Selected Files

</Typography>



<List dense>


{
files.map(
(file,index)=>(


<ListItem

key={index}


secondaryAction={


<IconButton

color="error"

onClick={()=>removeFile(index)}

>

<DeleteIcon/>

</IconButton>


}


>


<ListItemIcon>

{
fileIcon(file.name)
}

</ListItemIcon>




<ListItemText

primary={file.name}

secondary={

`${

(file.size/1024/1024)

.toFixed(2)

} MB`

}

/>


</ListItem>


)

)

}


</List>


</>

}





{
loading &&

<Box mt={2}>


<LinearProgress

variant="determinate"

value={progress}

/>


<Typography

align="center"

mt={1}

>

{progress}%

</Typography>


</Box>

}





<Button

fullWidth

variant="contained"

size="large"

sx={{

mt:3,

borderRadius:3,

height:50

}}

disabled={loading}

onClick={upload}

>


{

loading

?

<CircularProgress

color="inherit"

size={24}

/>

:

"Upload Files"

}


</Button>




</CardContent>


</Card>


);


};


export default UploadCard;