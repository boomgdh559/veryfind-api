const xlsx = require("xlsx");
const fs = require('fs');
const path = './Transcript.json';


// fs.readFile(path, (err, data) => {

//     if (!err) {
//         json = JSON.parse(data);

//         //jsonText = JSON.stringify(json);

//         // var transcript = xlsx.utils.json_to_sheet();
//         // var wb = xlsx.utils.book_new();
//         // xlsx.utils.book_append_sheet(wb, transcript, 'transcript');
//         // xlsx.writeFile(wb,'57130500060.xlsx');
//     }

// })

// var workBook = xlsx.readFile("./ExcelFile/SIT-IT-Transcript.xlsx");

// var workSheet = workBook.SheetNames;

// var data = xlsx.utils.sheet_to_json(workBook.Sheets[workSheet[0]]);

convertExcelToJSON = (file) => {
    workBook = xlsx.readFile(file);
    workSheet = workBook.SheetNames;
    rawFile = xlsx.utils.sheet_to_json(workBook.Sheets[workSheet[0]]);
    dataExcel = formatterJSON(rawFile);
    return dataExcel;
}


formatterJSON = (data) => {

    var jsonString = JSON.stringify(data);
    
    jsonString = jsonString.substr(0, jsonString.length - 1) + "\,{\"s]";
    var generalData = jsonString.match(/"stu(.*?)"registrar"(.*?)(?=,)/g);

    //semester : [semesterTitle + semesterDetail]
    var patternSemester = jsonString.match(/(("se(.*?))(("[A-F][+-]?"})+)(?=,{"s))/g);
    var allSemester = patternSemester.map((pattern) => {
        
        pattern = "{" + pattern;

        //semesterDetail
        //course
        //courseNo, courseTitle, credits, grades
        //console.log(pattern)
        patternEachCourse = pattern.match(/\"courseNo":"(.*?)\"[A-F][+-]?"/g);
        
        var eachCourse = patternEachCourse.map((course) => { return "{" + course + "}"; })
        patternCourse = ",\"course\" : [" + eachCourse + "]}";

        //totalCredit, totalGPA, cumGPA
        patternDetail = pattern.match(/"totalCredit(.*?),"cumGPA(.*?)[0-9].[0-9][0-9]?[0-9]?[0-9]?[0-9]?/g);

        //semesterDetail : { }
        patternSemesterDetail = ",\"semesterDetail\" : {" + patternDetail + patternCourse + "}";

        //semesterTitle
        patternSemesterTitle = pattern.match(/\"semesterTitle(.*?)[1-9][0-9][0-9][0-9]"/g);

        //semesterTitle + semesterDetail
        eachSemester = "{" + patternSemesterTitle + patternSemesterDetail;

        return eachSemester;

    })

    fetchStudentId = () => {

        jsonGeneral = "{" + generalData + "}";
        studentId = JSON.parse(jsonGeneral).studentID;
        header = JSON.stringify("KMUTT_Transcript_" + studentId);
        return header;

    }

    allTranscriptJSON = "{" + fetchStudentId() + ":{" + generalData + ",\"semester\" : [" + allSemester + "]}}"
    jsonGeneral = "{" + generalData + "}";
    id = JSON.parse(jsonGeneral).studentID;
    name = JSON.parse(jsonGeneral).name;
    degree = JSON.parse(jsonGeneral).degreeConferred;
    gpa = JSON.parse(jsonGeneral).totalGradGPA;
    gpa = gpa.toString();
    date = JSON.parse(jsonGeneral).dateOfGraduation;
    return {studentId:id,studentName:name,studentDegree : degree,studentGPA: gpa,studentDateGrad:date,studentJSONData : allTranscriptJSON};
}

dataJSON = (file) => {
    convertData = convertExcelToJSON(file)
    return convertData;
}

module.exports.convertToJSON = (file) => {
    return dataJSON(file);
}













