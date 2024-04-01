const net = require("net");

const server = new net.createServer();

let subscribe = "";

server.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");
  socket.on("data", (data) => {
    console.log("수신한 데이터:", data.toString());

    const bufferNull = Buffer.from([0x00]);
    let result = "";
    const payload = { leng: "", mid: "" };
    if (data.length > 20) {
      const datatoString = data.toString();
      payload.leng = datatoString.substr(0, 4);
      payload.mid = datatoString.substr(4, 4);
    }

    console.log(payload);
    //mid:0001
    if (payload.mid == "0001") {
      const buffer = Buffer.from(
        "01250002003 0000    010000020003                         04ACT05v2.0               06PF6_R_2.8.11.72_201071.3.7              "
      );
      result = Buffer.concat([buffer, bufferNull]);
    }
    //mid:0010
    if (payload.mid == "0010") {
      const buffer = Buffer.from("00240011001 0000    0011");
      result = Buffer.concat([buffer, bufferNull]);
    }
    //mid:0018
    if (payload.mid == "0018") {
      const buffer = Buffer.from("00240005001 0000    0018");
      result = Buffer.concat([buffer, bufferNull]);
    }

    //mid:0019
    if (payload.mid == "0019") {
      const buffer = Buffer.from("00240005001 0000    0019");
      result = Buffer.concat([buffer, bufferNull]);
    }

    //mid:0061
    if (payload.mid == "0060") {
      const buffer = Buffer.from(
        "02310061001 0000    010000020003                         04                         050006001070000080000091101111120005001300075014000550150005541600000170000018000001900000202020-12-10:21:55:13212020-10-18:04:05:12222230002076591"
      );
      result = Buffer.concat([buffer, bufferNull]);
      subscribe = setInterval(() => {
        socket.write(result);
        console.log("subscribe");
      }, 5000);
    }
    //mid:0061
    if (payload.mid == "0063") {
      clearInterval(subscribe);
      result = "00200063000000000000";
    }

    //mid:9999
    if (payload.mid == "9999") {
      const buffer = Buffer.from("00209999000000000000");
      result = Buffer.concat([buffer, bufferNull]);
    }

    socket.write(result);
    console.log("응답 전송:", result.toString());
  });

  socket.on("close", () => {
    console.log("클라이언트 연결이 종료되었습니다.");
  });

  socket.on("error", (err) => {
    console.error("에러 발생:", err);
  });
});

server.listen(4545, "127.0.0.1", () => {
  console.log("서버가 시작되었습니다. 클라이언트 연결 대기 중...");
});

/**
 *  mid: 1
 *  01250002003 0000    010000020003                         04ACT05v2.0               06PF6_R_2.8.11.72_201071.3.7
 *
 */
