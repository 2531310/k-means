// Công thức tính khoảng cách giữa hai điểm trong mặt phẳng tọa độ
let indexSTT_Input = 20;
let indexSTT_Tam = 3;
let data_Min_Ketqua = [];
let data_STT = [];
let data_Tam_Moi = [];

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - y1, 2) + Math.pow(x2 - y2, 2));
}

function addSTT(evt){
    indexSTT_Input++;
    document.getElementById('list-detail-stt').innerHTML += '<p>'+ indexSTT_Input +'.<input class=\"stt\" name=\'stt-'+ indexSTT_Input +'\' type=\'text\' placeholder=\'STT\' /\></p>';

}
function addTam(evt){
indexSTT_Tam++;
    document.getElementById('tam-detail').innerHTML += '<p>'+ indexSTT_Tam +'.<input class=\"tam\" name=\'tam-'+ indexSTT_Tam +'\' type=\'text\' placeholder=\'Tâm\' /\></p>';


}


// Hàm tính kết quả (đã sửa lỗi)
function tinhkq(evt){

    // reset dữ liệu
    data_Min_Ketqua = [];
    data_STT = [];

    document.getElementById('result').innerHTML = '';
    document.getElementById('result_min').innerHTML = '';
    document.getElementById('result_cluster').innerHTML = '';

    /* =============================
       1️⃣ LẤY DANH SÁCH STT (CHỈ 1 LẦN)
       ============================= */
    document.querySelectorAll('.list-detail .stt').forEach(el => {
        if(el.value !== ''){
            data_STT.push(el.value.split(','));
        }
    });

    /* =============================
       2️⃣ DUYỆT TỪNG TÂM
       ============================= */
    let indexTam = 0;

    document.querySelectorAll('.tam-detail .tam').forEach(elementTam => {
        if(elementTam.value !== ''){
            indexTam++;
            const tamArray = elementTam.value.split(',');

            document.getElementById('result').innerHTML += `<p>C${indexTam}</p>`;

            /* =============================
               3️⃣ DUYỆT TỪNG STT
               ============================= */
            data_STT.forEach((diemArray, indexSTT) => {

                const d = distance(
                    parseFloat(diemArray[0]),
                    parseFloat(tamArray[0]),
                    parseFloat(diemArray[1]),
                    parseFloat(tamArray[1])
                );

                const drounded = Math.round(d * 100) / 100;

                document.getElementById('result').innerHTML +=
                   `<div>d(x<sub>${indexSTT + 1}</sub>, C<sub>${indexTam}</sub>) = ${drounded}</div>`;

                // Khởi tạo min cho STT ở tâm đầu tiên
                if(indexTam === 1){
                    data_Min_Ketqua.push({
                        min: drounded,
                        stt: indexSTT + 1,
                        tam: indexTam
                    });
                }
                // So sánh với tâm khác
                else{
                    if(data_Min_Ketqua[indexSTT].min > drounded){
                        data_Min_Ketqua[indexSTT].min = drounded;
                        data_Min_Ketqua[indexSTT].tam = indexTam;
                    }
                }
            });

            document.getElementById('result').innerHTML += '<br>';
        }
    });

    /* =============================
       4️⃣ HIỂN THỊ KẾT QUẢ MIN
       ============================= */
    data_Min_Ketqua.forEach(kq => {
        document.getElementById('result_min').innerHTML +=
            `<p>STT: ${kq.stt} -&nbsp; Min: ${kq.min} &nbsp;-> Tâm: C${kq.tam}</p>`;
    });

    /* =============================
       5️⃣ GOM CỤM Cj {STT}
       ============================= */
    let clusterMap = {};

    data_Min_Ketqua.forEach(item => {
        if(!clusterMap[item.tam]){
            clusterMap[item.tam] = [];
        }
        clusterMap[item.tam].push(item.stt);
    });

    Object.keys(clusterMap).forEach(tam => {
        document.getElementById('result_cluster').innerHTML +=
            `<p>C${tam} {${clusterMap[tam].join(',')}}</p>`;
    });

  tinhlaitam(evt);
}


// tinh lại tâm (làm tròn 2 số thập phân)
function tinhlaitam(evt){
    let indexTinhLaiTam = 0;
    data_Tam_Moi = [];
    document.getElementById('result_tam').innerHTML = '';

    document.querySelectorAll('.tam-detail .tam').forEach(elementam => {
        if(elementam.value !== ''){
            indexTinhLaiTam++;

            const tambyGroup = data_Min_Ketqua.filter(t => t.tam === indexTinhLaiTam);

            if(tambyGroup && tambyGroup.length > 0){
                let count = 0;
                let sumX = 0;
                let sumY = 0;

                tambyGroup.forEach(k => {
                    const diem = data_STT[k.stt - 1];
                    if(diem){
                        sumX += parseFloat(diem[0]);
                        sumY += parseFloat(diem[1]);
                        count++;
                    }
                });

                let x = sumX / count;
                let y = sumY / count;

                // làm tròn 2 số thập phân
                x = Math.round(x * 100) / 100;
                y = Math.round(y * 100) / 100;

                // lưu tâm mới
                data_Tam_Moi.push({
                    tam: indexTinhLaiTam,
                    x: x,
                    y: y
                });

                document.getElementById('result_tam').innerHTML +=
                    `<p>C${indexTinhLaiTam} (${x}, ${y})</p>`;
            }
        }
    });
}

// cập nhật tâm mới vào input
function capnhattammoi(evt){
    const tamInputs = document.querySelectorAll('.tam-detail .tam');

    data_Tam_Moi.forEach(t => {
        const index = t.tam - 1;
        if(tamInputs[index]){
            tamInputs[index].value = `${t.x},${t.y}`;
        }
    });
}

