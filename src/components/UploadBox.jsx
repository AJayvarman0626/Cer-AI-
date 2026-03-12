import { useDropzone } from "react-dropzone";

function UploadBox({ setFile, preview, setPreview }) {

const onDrop = (acceptedFiles) => {

const file = acceptedFiles[0];
if (!file) return;

setFile(file);
setPreview(URL.createObjectURL(file));

};

const { getRootProps, getInputProps, isDragActive } = useDropzone({
onDrop,
accept: { "image/*": [] }
});

return (

<div style={styles.wrapper}>

  <div
    {...getRootProps()}
    style={{
      ...styles.box,
      borderColor: isDragActive ? "#22c55e" : "#38bdf8",
      background: isDragActive ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.02)"
    }}
  >

    <input {...getInputProps()} />

    <div style={styles.icon}>🧬</div>

    <p style={styles.text}>
      Drag & Drop Pap Smear Image
    </p>

    <p style={styles.subtext}>
      or click to upload
    </p>

  </div>

  {preview && (

    <div style={styles.previewCard}>

      <img
        src={preview}
        style={styles.preview}
      />

    </div>

  )}

</div>

);
}

const styles = {

wrapper:{
marginTop:"20px"
},

box:{
border:"2px dashed",
padding:"45px",
borderRadius:"14px",
textAlign:"center",
cursor:"pointer",
transition:"all 0.25s ease",
backdropFilter:"blur(6px)"
},

icon:{
fontSize:"32px",
marginBottom:"10px"
},

text:{
fontSize:"16px"
},

subtext:{
opacity:0.6,
fontSize:"14px"
},

previewCard:{
marginTop:"20px",
display:"flex",
justifyContent:"center"
},

preview:{
width:"260px",
borderRadius:"12px",
border:"1px solid rgba(255,255,255,0.1)"
}

};

export default UploadBox;