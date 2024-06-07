import { defineMessages } from 'react-intl';

export const commonLabel = defineMessages({
    videos: 'Videos',
    articles: 'Articles',
    games: 'Games',
    quiz: 'Quiz',
    lesson: 'lesson',

    welcomeUser: 'Welcome, {user}',
});

export const commonButton = defineMessages({
    login: 'Login',
});

export const statusMessage = defineMessages({
    active: 'Active',
    pending: 'Pending',
    inactive: 'Inactive',
});

export const dateFilterMessage = defineMessages({
    today: 'Today',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    custom: 'Custom',
});
export const orderStateMessage = defineMessages({
    done: 'Done',
    pending: 'Pending',
    cancel: 'Cancel',
});

export const genderMessage = defineMessages({
    male: 'Male',
    female: 'Female',
});

export const salaryTypeMessage = defineMessages({
    share: 'Share',
    full: 'Full',
});

export const dayOfWeek = defineMessages({
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật',
});

export const daysOfWeekSchedule = [
    { value: 'monday', label: dayOfWeek.monday },
    { value: 'tuesday', label: dayOfWeek.tuesday },
    { value: 'wednesday', label: dayOfWeek.wednesday },
    { value: 'thursday', label: dayOfWeek.thursday },
    { value: 'friday', label: dayOfWeek.friday },
    { value: 'saturday', label: dayOfWeek.saturday },
    { value: 'sunday', label: dayOfWeek.sunday },
];

export const promotionKindOptionIntl = defineMessages({
    one: 'Nhiều mã',
    multiple: 'Một mã',
});

export const discountTypeOptionIntl = defineMessages({
    percent: 'Phần trăm',
    money: 'Tiền',
});

export const statePromotion = defineMessages({
    cancel: 'Huỷ',
    end: 'Kết thúc',
    running: 'Đang chạy',
    created: 'Mới tạo',
});

export const lectureKindMessage = defineMessages({
    section: 'Chương',
    lesson: 'Bài học',
    chapter: 'Chương',
    video: 'Video',
});

export const lectureStateMessage = defineMessages({
    prepared: 'Chưa bắt đầu',
    started: 'Đã bắt đầu',
    finished: 'Đã hoàn thành',
    canceled: 'Đã hủy',
    recruit: 'Chiêu sinh',
});

export const taskKindMessage = defineMessages({
    feature: 'Tính năng',
    bug: 'Bug',
    testCase: 'Test case',
});

export const taskStateMessage = defineMessages({
    asign: 'Đang làm',
    done: 'Hoàn thành',
});

export const stateResgistrationMessage = defineMessages({
    register: 'Đăng ký',
    learning: 'Đang học',
    finished: 'Đã hoành thành',
    canceled: 'Đã huỷ',
});

export const statusSubjectMessage = defineMessages({
    active: 'Hoạt động',
    canceled: 'Đã huỷ',
});

export const projectTaskStateMessage = defineMessages({
    create: 'Đang tạo',
    processing: 'Đang xử lý',
    done: 'Hoàn tất',
    cancel: 'Đã hủy',
});
export const salaryPeriodStateMessage = defineMessages({
    create: 'Đang tạo',
    processing: 'Đang xử lý',
    done: 'Hoàn tất',
});
export const actionMessage = defineMessages({
    contactForm: 'Biểu mẫu liên hệ',
    navigation: 'Chuyển hướng',
});
export const registrationMoneyKindMessage = defineMessages({
    receivedMoney: 'Tiền nhận',
    returnMoney: 'Tiền trả lại',
});

export const stateCourseRequestMessage = defineMessages({
    request: 'Yêu cầu',
    processed: 'Đã xử lý',
    cancel: 'Đã huỷ',
});

export const taskLog = defineMessages({
    working: 'Làm việc',
    off: 'Nghỉ phép',
    bug: 'Bug',

});

export const companySeek = defineMessages({
    looking: 'Tìm kiếm',
    accept: 'Chấp nhận',
});

export const expYearMessage = defineMessages({
    noExperience: 'Chưa có kinh nghiệm',
    oneYear: '1 năm',
    twoYear: '2 năm',
    threeYear: '3 năm',
    fourYear: '4 năm',
    fiveYear: '5 năm',
});

export const archivedMessage = defineMessages({
    NotReset: 'Chưa reset',
    Reset: 'Đã reset',
});
export const salaryMessage = defineMessages({
    fix: 'Lương cố định',
    hour: 'Lương theo giờ',
});
export const returnFeeMessage = defineMessages({
    returnFeeTrue: 'Được hoàn trả',
    returnMoneyFalse: 'Không được hoàn trả',
});
export const dayOffLogMessage = defineMessages({
    noCharge : 'Không trừ tiền',
    charge: 'Trừ tiền',
});
