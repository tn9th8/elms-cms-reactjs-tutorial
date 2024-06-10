import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useDragDrop from '@hooks/useDragDrop';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React, { useMemo, createContext, useContext, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Table, Row } from 'antd';
import { HolderOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Bài giảng',
    lecture: 'Bài giảng',
});

const RowContext = createContext({});
const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{ cursor: 'move' }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};
// const columns1 = [
//     { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
//     { title: 'Tên bài giảng', dataIndex: 'lectureName' },
// ];

const initialData = [
    {
        id: 7494750559731712,
        lectureName: 'Giới thiệu môn học',
        lectureKind: 2,
        shortDescription: '123',
        description:
            '<p><strong>JavaScript</strong>&nbsp;là ngôn ngữ lập trình phổ biến nhất trên thế giới trong suốt 20 năm qua. Nó cũng là một trong số 3 ngôn ngữ chính của lập trình web:</p><ol><li><strong style="color: rgb(103, 71, 199);">HTML</strong>: Giúp bạn thêm nội dung cho trang web.</li><li><strong style="color: rgb(103, 71, 199);">CSS</strong>: Định dạng thiết kế, bố cục, phong cách, canh lề của trang web.</li><li>JavaScript: Cải thiện cách hoạt động của trang web.</li></ol><p>JavaScript có thể&nbsp;<strong style="color: rgb(103, 71, 199);">học nhanh</strong>&nbsp;và dễ dàng áp dụng cho nhiều mục đích khác nhau, từ việc cải thiện tính năng của website đến việc chạy game và tạo phần mềm nền web. Hơn nữa, có hàng ngàn mẫu template JavaScript và ứng dụng ngoài kia, nhờ vào sự cống hiến của cộng đồng, đặc biệt là Github.</p><p><strong>Mua hosting ngay để học hỏi, thực hành và phát triển. Khuyến mãi giá hosting rẻ nhất</strong></p><ul><li><strong style="color: rgb(103, 61, 230);">JavaScript ngày đó và bây giờ</strong></li><li><strong style="color: rgb(103, 61, 230);">Điều gì khiến JavaScript trở nên vĩ đại?</strong></li><li><strong style="color: rgb(103, 61, 230);">Khuyết điểm của JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Cách hoạt động của JavaScript trên trang web là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Điểm khác biệt giữa các ngôn ngữ lập trình khác và JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Làm thế nào để thêm JavaScript trên website của bạn?</strong></li><li><strong style="color: rgb(103, 61, 230);">Vậy, JavaScript là gì?</strong></li></ul><h2>JavaScript ngày đó và bây giờ</h2><p>JavaScript được tạo trong mười ngày bởi Brandan Eich, một nhân viên của Netscape, vào tháng 9 năm 1995. Được đặt tên đầu tiên là Mocha, tên của nó được đổi thành Mona rồi LiveScript trước khi thật sự trở thành JavaScript nổi tiếng như bây giờ. Phiên bản đầu tiên của ngôn ngữ này bị giới hạn độc quyền bởi Netscape và chỉ có các tính năng hạn chế, nhưng nó tiếp tục phát triển theo thời gian, nhờ một phần vào cộng đồng các lập trình viên đã liên tục làm việc với nó.</p><p>Trong năm 1996, JavaScript được chính thức đặt tên là ECMAScript. ECMAScript 2 phát hành năm 1998 và ECMAScript 3 tiếp tục ra mắt vào năm 1999. Nó liên tục phát triển thành JavaScript ngày nay, giờ đã hoạt động trên khắp mọi trình duyệt và trên khắp các thiết bị từ di động đến máy tính bàn.</p><p>JavaScript liên tục phát triển kể từ đó, có lục đạt đến 92% website đang sử dụng JavaScript vào năm 2016. Chỉ trong 20 năm, nó từ một ngôn ngữ lập trình riêng trở thành công cụ quan trọng nhất trên bộ công cụ của các chuyên viên lập trình web. Nếu bạn đang dùng internet, vậy chắc chắn bạn đã từng sử dụng JavaScript rồi.</p><h2>Điều gì khiến JavaScript trở nên vĩ đại?</h2><p>JavaScript có rất nhiều ưu điểm khiến nó vượt trội hơn so với các đối thủ, đặc biệt trong các trường hợp thực tế. Sau đây chỉ là một số lợi ích của JavaScript:</p><ol><li>Bạn không cần một compiler vì web browser có thể biên dịch nó bằng HTML;</li><li>Nó dễ học hơn các ngôn ngữ lập trình khác;</li><li>Lỗi dễ phát hiện hơn và vì vậy dễ sửa hơn;</li><li>Nó có thể được gắn trên một số element của trang web hoặc event của trang web như là thông qua click chuột hoặc di chuột tới;</li><li>JS hoạt động trên nhiều trình duyệt, nền tảng, vâng vâng;</li><li>Bạn có thể sử dụng JavaScript để kiểm tra input và giảm thiểu việc kiểm tra thủ công khi truy xuất qua database;</li><li>Nó giúp website tương tác tốt hơn với khách truy cập;</li><li>Nó nhanh hơn và nhẹ hơn các ngôn ngữ lập trình khác.</li></ol><h2>Khuyết điểm của JavaScript là gì?</h2><p>Mọi ngôn ngữ lập trình đều có các khuyết điểm. Một phần là vì ngôn ngữ đó khi phát triển đến một mức độ như JavaScript, nó cũng sẽ thu hút lượng lớn hacker, scammer, và những người có ác tâm luôn tìm kiếm những lỗ hổng và các lỗi bảo mật để lợi dụng nó. Một số khuyết điểm có thể kể đến là:</p><ol><li>Dễ bị khai thác;</li><li>Có thể được dùng để thực thi mã độc trên máy tính của người dùng;</li><li>Nhiều khi không được hỗ trợ trên mọi trình duyệt;</li><li>JS code snippets lớn;</li><li>Có thể bị triển khai khác nhau tùy từng thiết bị dẫn đến việc không đồng nhất.</li></ol><p><br></p>',
        urlDocument: 'https://200lab.io/lessons/cai-dat-moi-truong-vs-code-va-goland-setup-environment',
        ordering: 1,
        subject: {
            id: 7404362629742592,
            subjectName: 'Lập trình Golang',
            subjectCode: 'mh2',
            status: 1,
        },
    },
    {
        id: 7494750559731712,
        lectureName: 'Giới thiệu môn học',
        lectureKind: 2,
        shortDescription: '123',
        description:
            '<p><strong>JavaScript</strong>&nbsp;là ngôn ngữ lập trình phổ biến nhất trên thế giới trong suốt 20 năm qua. Nó cũng là một trong số 3 ngôn ngữ chính của lập trình web:</p><ol><li><strong style="color: rgb(103, 71, 199);">HTML</strong>: Giúp bạn thêm nội dung cho trang web.</li><li><strong style="color: rgb(103, 71, 199);">CSS</strong>: Định dạng thiết kế, bố cục, phong cách, canh lề của trang web.</li><li>JavaScript: Cải thiện cách hoạt động của trang web.</li></ol><p>JavaScript có thể&nbsp;<strong style="color: rgb(103, 71, 199);">học nhanh</strong>&nbsp;và dễ dàng áp dụng cho nhiều mục đích khác nhau, từ việc cải thiện tính năng của website đến việc chạy game và tạo phần mềm nền web. Hơn nữa, có hàng ngàn mẫu template JavaScript và ứng dụng ngoài kia, nhờ vào sự cống hiến của cộng đồng, đặc biệt là Github.</p><p><strong>Mua hosting ngay để học hỏi, thực hành và phát triển. Khuyến mãi giá hosting rẻ nhất</strong></p><ul><li><strong style="color: rgb(103, 61, 230);">JavaScript ngày đó và bây giờ</strong></li><li><strong style="color: rgb(103, 61, 230);">Điều gì khiến JavaScript trở nên vĩ đại?</strong></li><li><strong style="color: rgb(103, 61, 230);">Khuyết điểm của JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Cách hoạt động của JavaScript trên trang web là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Điểm khác biệt giữa các ngôn ngữ lập trình khác và JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Làm thế nào để thêm JavaScript trên website của bạn?</strong></li><li><strong style="color: rgb(103, 61, 230);">Vậy, JavaScript là gì?</strong></li></ul><h2>JavaScript ngày đó và bây giờ</h2><p>JavaScript được tạo trong mười ngày bởi Brandan Eich, một nhân viên của Netscape, vào tháng 9 năm 1995. Được đặt tên đầu tiên là Mocha, tên của nó được đổi thành Mona rồi LiveScript trước khi thật sự trở thành JavaScript nổi tiếng như bây giờ. Phiên bản đầu tiên của ngôn ngữ này bị giới hạn độc quyền bởi Netscape và chỉ có các tính năng hạn chế, nhưng nó tiếp tục phát triển theo thời gian, nhờ một phần vào cộng đồng các lập trình viên đã liên tục làm việc với nó.</p><p>Trong năm 1996, JavaScript được chính thức đặt tên là ECMAScript. ECMAScript 2 phát hành năm 1998 và ECMAScript 3 tiếp tục ra mắt vào năm 1999. Nó liên tục phát triển thành JavaScript ngày nay, giờ đã hoạt động trên khắp mọi trình duyệt và trên khắp các thiết bị từ di động đến máy tính bàn.</p><p>JavaScript liên tục phát triển kể từ đó, có lục đạt đến 92% website đang sử dụng JavaScript vào năm 2016. Chỉ trong 20 năm, nó từ một ngôn ngữ lập trình riêng trở thành công cụ quan trọng nhất trên bộ công cụ của các chuyên viên lập trình web. Nếu bạn đang dùng internet, vậy chắc chắn bạn đã từng sử dụng JavaScript rồi.</p><h2>Điều gì khiến JavaScript trở nên vĩ đại?</h2><p>JavaScript có rất nhiều ưu điểm khiến nó vượt trội hơn so với các đối thủ, đặc biệt trong các trường hợp thực tế. Sau đây chỉ là một số lợi ích của JavaScript:</p><ol><li>Bạn không cần một compiler vì web browser có thể biên dịch nó bằng HTML;</li><li>Nó dễ học hơn các ngôn ngữ lập trình khác;</li><li>Lỗi dễ phát hiện hơn và vì vậy dễ sửa hơn;</li><li>Nó có thể được gắn trên một số element của trang web hoặc event của trang web như là thông qua click chuột hoặc di chuột tới;</li><li>JS hoạt động trên nhiều trình duyệt, nền tảng, vâng vâng;</li><li>Bạn có thể sử dụng JavaScript để kiểm tra input và giảm thiểu việc kiểm tra thủ công khi truy xuất qua database;</li><li>Nó giúp website tương tác tốt hơn với khách truy cập;</li><li>Nó nhanh hơn và nhẹ hơn các ngôn ngữ lập trình khác.</li></ol><h2>Khuyết điểm của JavaScript là gì?</h2><p>Mọi ngôn ngữ lập trình đều có các khuyết điểm. Một phần là vì ngôn ngữ đó khi phát triển đến một mức độ như JavaScript, nó cũng sẽ thu hút lượng lớn hacker, scammer, và những người có ác tâm luôn tìm kiếm những lỗ hổng và các lỗi bảo mật để lợi dụng nó. Một số khuyết điểm có thể kể đến là:</p><ol><li>Dễ bị khai thác;</li><li>Có thể được dùng để thực thi mã độc trên máy tính của người dùng;</li><li>Nhiều khi không được hỗ trợ trên mọi trình duyệt;</li><li>JS code snippets lớn;</li><li>Có thể bị triển khai khác nhau tùy từng thiết bị dẫn đến việc không đồng nhất.</li></ol><p><br></p>',
        urlDocument: 'https://200lab.io/lessons/cai-dat-moi-truong-vs-code-va-goland-setup-environment',
        ordering: 2,
        subject: {
            id: 7404362629742592,
            subjectName: 'Lập trình Golang',
            subjectCode: 'mh2',
            status: 1,
        },
    },
    {
        id: 7494750559731712,
        lectureName: 'Giới thiệu môn học',
        lectureKind: 2,
        shortDescription: '123',
        description:
            '<p><strong>JavaScript</strong>&nbsp;là ngôn ngữ lập trình phổ biến nhất trên thế giới trong suốt 20 năm qua. Nó cũng là một trong số 3 ngôn ngữ chính của lập trình web:</p><ol><li><strong style="color: rgb(103, 71, 199);">HTML</strong>: Giúp bạn thêm nội dung cho trang web.</li><li><strong style="color: rgb(103, 71, 199);">CSS</strong>: Định dạng thiết kế, bố cục, phong cách, canh lề của trang web.</li><li>JavaScript: Cải thiện cách hoạt động của trang web.</li></ol><p>JavaScript có thể&nbsp;<strong style="color: rgb(103, 71, 199);">học nhanh</strong>&nbsp;và dễ dàng áp dụng cho nhiều mục đích khác nhau, từ việc cải thiện tính năng của website đến việc chạy game và tạo phần mềm nền web. Hơn nữa, có hàng ngàn mẫu template JavaScript và ứng dụng ngoài kia, nhờ vào sự cống hiến của cộng đồng, đặc biệt là Github.</p><p><strong>Mua hosting ngay để học hỏi, thực hành và phát triển. Khuyến mãi giá hosting rẻ nhất</strong></p><ul><li><strong style="color: rgb(103, 61, 230);">JavaScript ngày đó và bây giờ</strong></li><li><strong style="color: rgb(103, 61, 230);">Điều gì khiến JavaScript trở nên vĩ đại?</strong></li><li><strong style="color: rgb(103, 61, 230);">Khuyết điểm của JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Cách hoạt động của JavaScript trên trang web là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Điểm khác biệt giữa các ngôn ngữ lập trình khác và JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Làm thế nào để thêm JavaScript trên website của bạn?</strong></li><li><strong style="color: rgb(103, 61, 230);">Vậy, JavaScript là gì?</strong></li></ul><h2>JavaScript ngày đó và bây giờ</h2><p>JavaScript được tạo trong mười ngày bởi Brandan Eich, một nhân viên của Netscape, vào tháng 9 năm 1995. Được đặt tên đầu tiên là Mocha, tên của nó được đổi thành Mona rồi LiveScript trước khi thật sự trở thành JavaScript nổi tiếng như bây giờ. Phiên bản đầu tiên của ngôn ngữ này bị giới hạn độc quyền bởi Netscape và chỉ có các tính năng hạn chế, nhưng nó tiếp tục phát triển theo thời gian, nhờ một phần vào cộng đồng các lập trình viên đã liên tục làm việc với nó.</p><p>Trong năm 1996, JavaScript được chính thức đặt tên là ECMAScript. ECMAScript 2 phát hành năm 1998 và ECMAScript 3 tiếp tục ra mắt vào năm 1999. Nó liên tục phát triển thành JavaScript ngày nay, giờ đã hoạt động trên khắp mọi trình duyệt và trên khắp các thiết bị từ di động đến máy tính bàn.</p><p>JavaScript liên tục phát triển kể từ đó, có lục đạt đến 92% website đang sử dụng JavaScript vào năm 2016. Chỉ trong 20 năm, nó từ một ngôn ngữ lập trình riêng trở thành công cụ quan trọng nhất trên bộ công cụ của các chuyên viên lập trình web. Nếu bạn đang dùng internet, vậy chắc chắn bạn đã từng sử dụng JavaScript rồi.</p><h2>Điều gì khiến JavaScript trở nên vĩ đại?</h2><p>JavaScript có rất nhiều ưu điểm khiến nó vượt trội hơn so với các đối thủ, đặc biệt trong các trường hợp thực tế. Sau đây chỉ là một số lợi ích của JavaScript:</p><ol><li>Bạn không cần một compiler vì web browser có thể biên dịch nó bằng HTML;</li><li>Nó dễ học hơn các ngôn ngữ lập trình khác;</li><li>Lỗi dễ phát hiện hơn và vì vậy dễ sửa hơn;</li><li>Nó có thể được gắn trên một số element của trang web hoặc event của trang web như là thông qua click chuột hoặc di chuột tới;</li><li>JS hoạt động trên nhiều trình duyệt, nền tảng, vâng vâng;</li><li>Bạn có thể sử dụng JavaScript để kiểm tra input và giảm thiểu việc kiểm tra thủ công khi truy xuất qua database;</li><li>Nó giúp website tương tác tốt hơn với khách truy cập;</li><li>Nó nhanh hơn và nhẹ hơn các ngôn ngữ lập trình khác.</li></ol><h2>Khuyết điểm của JavaScript là gì?</h2><p>Mọi ngôn ngữ lập trình đều có các khuyết điểm. Một phần là vì ngôn ngữ đó khi phát triển đến một mức độ như JavaScript, nó cũng sẽ thu hút lượng lớn hacker, scammer, và những người có ác tâm luôn tìm kiếm những lỗ hổng và các lỗi bảo mật để lợi dụng nó. Một số khuyết điểm có thể kể đến là:</p><ol><li>Dễ bị khai thác;</li><li>Có thể được dùng để thực thi mã độc trên máy tính của người dùng;</li><li>Nhiều khi không được hỗ trợ trên mọi trình duyệt;</li><li>JS code snippets lớn;</li><li>Có thể bị triển khai khác nhau tùy từng thiết bị dẫn đến việc không đồng nhất.</li></ol><p><br></p>',
        urlDocument: 'https://200lab.io/lessons/cai-dat-moi-truong-vs-code-va-goland-setup-environment',
        ordering: 3,
        subject: {
            id: 7404362629742592,
            subjectName: 'Lập trình Golang',
            subjectCode: 'mh2',
            status: 1,
        },
    },
    {
        id: 7494750559731712,
        lectureName: 'Giới thiệu môn học',
        lectureKind: 2,
        shortDescription: '123',
        description:
            '<p><strong>JavaScript</strong>&nbsp;là ngôn ngữ lập trình phổ biến nhất trên thế giới trong suốt 20 năm qua. Nó cũng là một trong số 3 ngôn ngữ chính của lập trình web:</p><ol><li><strong style="color: rgb(103, 71, 199);">HTML</strong>: Giúp bạn thêm nội dung cho trang web.</li><li><strong style="color: rgb(103, 71, 199);">CSS</strong>: Định dạng thiết kế, bố cục, phong cách, canh lề của trang web.</li><li>JavaScript: Cải thiện cách hoạt động của trang web.</li></ol><p>JavaScript có thể&nbsp;<strong style="color: rgb(103, 71, 199);">học nhanh</strong>&nbsp;và dễ dàng áp dụng cho nhiều mục đích khác nhau, từ việc cải thiện tính năng của website đến việc chạy game và tạo phần mềm nền web. Hơn nữa, có hàng ngàn mẫu template JavaScript và ứng dụng ngoài kia, nhờ vào sự cống hiến của cộng đồng, đặc biệt là Github.</p><p><strong>Mua hosting ngay để học hỏi, thực hành và phát triển. Khuyến mãi giá hosting rẻ nhất</strong></p><ul><li><strong style="color: rgb(103, 61, 230);">JavaScript ngày đó và bây giờ</strong></li><li><strong style="color: rgb(103, 61, 230);">Điều gì khiến JavaScript trở nên vĩ đại?</strong></li><li><strong style="color: rgb(103, 61, 230);">Khuyết điểm của JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Cách hoạt động của JavaScript trên trang web là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Điểm khác biệt giữa các ngôn ngữ lập trình khác và JavaScript là gì?</strong></li><li><strong style="color: rgb(103, 61, 230);">Làm thế nào để thêm JavaScript trên website của bạn?</strong></li><li><strong style="color: rgb(103, 61, 230);">Vậy, JavaScript là gì?</strong></li></ul><h2>JavaScript ngày đó và bây giờ</h2><p>JavaScript được tạo trong mười ngày bởi Brandan Eich, một nhân viên của Netscape, vào tháng 9 năm 1995. Được đặt tên đầu tiên là Mocha, tên của nó được đổi thành Mona rồi LiveScript trước khi thật sự trở thành JavaScript nổi tiếng như bây giờ. Phiên bản đầu tiên của ngôn ngữ này bị giới hạn độc quyền bởi Netscape và chỉ có các tính năng hạn chế, nhưng nó tiếp tục phát triển theo thời gian, nhờ một phần vào cộng đồng các lập trình viên đã liên tục làm việc với nó.</p><p>Trong năm 1996, JavaScript được chính thức đặt tên là ECMAScript. ECMAScript 2 phát hành năm 1998 và ECMAScript 3 tiếp tục ra mắt vào năm 1999. Nó liên tục phát triển thành JavaScript ngày nay, giờ đã hoạt động trên khắp mọi trình duyệt và trên khắp các thiết bị từ di động đến máy tính bàn.</p><p>JavaScript liên tục phát triển kể từ đó, có lục đạt đến 92% website đang sử dụng JavaScript vào năm 2016. Chỉ trong 20 năm, nó từ một ngôn ngữ lập trình riêng trở thành công cụ quan trọng nhất trên bộ công cụ của các chuyên viên lập trình web. Nếu bạn đang dùng internet, vậy chắc chắn bạn đã từng sử dụng JavaScript rồi.</p><h2>Điều gì khiến JavaScript trở nên vĩ đại?</h2><p>JavaScript có rất nhiều ưu điểm khiến nó vượt trội hơn so với các đối thủ, đặc biệt trong các trường hợp thực tế. Sau đây chỉ là một số lợi ích của JavaScript:</p><ol><li>Bạn không cần một compiler vì web browser có thể biên dịch nó bằng HTML;</li><li>Nó dễ học hơn các ngôn ngữ lập trình khác;</li><li>Lỗi dễ phát hiện hơn và vì vậy dễ sửa hơn;</li><li>Nó có thể được gắn trên một số element của trang web hoặc event của trang web như là thông qua click chuột hoặc di chuột tới;</li><li>JS hoạt động trên nhiều trình duyệt, nền tảng, vâng vâng;</li><li>Bạn có thể sử dụng JavaScript để kiểm tra input và giảm thiểu việc kiểm tra thủ công khi truy xuất qua database;</li><li>Nó giúp website tương tác tốt hơn với khách truy cập;</li><li>Nó nhanh hơn và nhẹ hơn các ngôn ngữ lập trình khác.</li></ol><h2>Khuyết điểm của JavaScript là gì?</h2><p>Mọi ngôn ngữ lập trình đều có các khuyết điểm. Một phần là vì ngôn ngữ đó khi phát triển đến một mức độ như JavaScript, nó cũng sẽ thu hút lượng lớn hacker, scammer, và những người có ác tâm luôn tìm kiếm những lỗ hổng và các lỗi bảo mật để lợi dụng nó. Một số khuyết điểm có thể kể đến là:</p><ol><li>Dễ bị khai thác;</li><li>Có thể được dùng để thực thi mã độc trên máy tính của người dùng;</li><li>Nhiều khi không được hỗ trợ trên mọi trình duyệt;</li><li>JS code snippets lớn;</li><li>Có thể bị triển khai khác nhau tùy từng thiết bị dẫn đến việc không đồng nhất.</li></ol><p><br></p>',
        urlDocument: 'https://200lab.io/lessons/cai-dat-moi-truong-vs-code-va-goland-setup-environment',
        ordering: 4,
        subject: {
            id: 7404362629742592,
            subjectName: 'Lập trình Golang',
            subjectCode: 'mh2',
            status: 1,
        },
    },
];

const SortableRow = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });

    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    const contextValue = useMemo(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

const SubjectDetailPage = () => {
    const params = useParams();
    const translate = useTranslate();

    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: {
            ...apiConfig.lecture,
            getList: (apiConfig.lecture.getBySubject = {
                ...apiConfig.lecture.getBySubject,
                baseURL: apiConfig.lecture.getBySubject.baseURL.replace(':subjectId', params.id),
            }),
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });
    // console.log('data', data);

    // const [sortedData, setSortedData] = useState(initialData);
    // console.log('sortedData', sortedData);

    const { sortedData, onDragEnd, sortColumn, handleUpdate } = useDragDrop({
        data,
        apiConfig: apiConfig.lecture.updateSort,
        indexField: 'ordering',
    });
    console.log('sorted data', sortedData);

    const columns = [
        {
            ...sortColumn,
            // key: 'sort',
            // align: 'center',
            // width: 30,
            render: () => <DragHandle />,
        },
        {
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: ['lectureName'],
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    // const onDragEnd = ({ active, over }) => {
    //     if (active.id !== over?.id) {
    //         setSortedData((prevState) => {
    //             const activeIndex = prevState.findIndex((record) => record.ordering === active?.id);
    //             const overIndex = prevState.findIndex((record) => record.ordering === over?.id);
    //             return arrayMove(prevState, activeIndex, overIndex);
    //         });
    //     }
    // };

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.subject),
                    path: generatePath(routes.subjectListPage.path),
                },
                { breadcrumbName: translate.formatMessage(commonMessage.lecture) },
            ]}
        >
            <ListPage
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                        <SortableContext
                            items={sortedData.map((i) => i.ordering)}
                            strategy={verticalListSortingStrategy}
                        >
                            <BaseTable
                                onChange={mixinFuncs.changePagination}
                                columns={columns}
                                dataSource={sortedData}
                                loading={loading}
                                pagination={pagination}
                                rowKey={{ id: 'ordering' }}
                                components={{ body: { row: SortableRow } }}
                            />
                        </SortableContext>
                    </DndContext>
                    // <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    //     <SortableContext
                    //         items={sortedData.map((i) => i.ordering)}
                    //         strategy={verticalListSortingStrategy}
                    //     >
                    //         <Table
                    //             rowKey="ordering"
                    //             components={{ body: { row: Row } }}
                    //             columns={columns}
                    //             dataSource={sortedData}
                    //         />
                    //     </SortableContext>
                    // </DndContext>
                }
            >
                <Row justify="end">
                    <Col>
                        <Button type="primary" onClick={handleUpdate}>
                            Cập nhật vị trí
                        </Button>
                    </Col>
                </Row>
            </ListPage>
        </PageWrapper>
    );
};
export default SubjectDetailPage;
