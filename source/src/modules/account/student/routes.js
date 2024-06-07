import apiConfig from "@constants/apiConfig";
import StudentListPage from ".";
import StudentSavePage from "./studentSavePage";



export default {
    studentListPage: {
        path: '/student',
        title: 'Student',
        auth: true,
        component: StudentListPage,
        permissions: [apiConfig.student.getList.baseURL],
    },
    studentSavePage: {
        path: '/student/:id',
        title: 'Student Save Page',
        auth: true,
        component: StudentSavePage,
        permissions: [apiConfig.student.create.baseURL, apiConfig.student.update.baseURL],
    },
   
   
};
