<template>
  <div class="bg">
    <!-- desktop -->
    <div class="box absolute-center desktop-only">
      <div class="row">
        <!-- Logo  -->
        <div class="col-md-6 col-sm-6 col-xs-6 z-top">
          <div class="boxcard box-pos bg-blue-grey-10 boxshadow">
            <div align="center" class="q-pa-lg">
              <div class="q-mb-lg q-mt-lg q-pt-md">
                <img style="width:180px; height:180px" src="../assets/loginlogo.png" />
              </div>
              <div class="text-white">
                <img style="width:50px; height:30px" src="../assets/loginxs.png" alt />
                <span class="text-h5 q-px-sm">Winner@work</span>
              </div>
            </div>
          </div>
        </div>

        <!-- กรอก User & Password -->
        <div class="bg-white box-radius col-md-6 col-sm-6 col-xs-6">
          <div class="row items-center justify-center full-height" align="center">
            <div class="q-pt-md col-12">
              <img
                style="width:90px; height:90px"
                :src="'../statics/avatar/' + SystemAccounts.avatar + '.png'"
              />
            </div>
            <div class="text-h5">{{SystemAccounts.name}}</div>
            <div underline-color class="q-pb-md q-px-xl col-12">{{welcomeTitle[randomIndex]}}</div>

            <!-- Btn -->
            <div class="q-py-md col-12">
              <q-btn class="btn" @click="loginBtn()" color="secondary" label="เข้าสู่ระบบ" />
            </div>

            <div @click="loginAgain()" class="col-12 q-pb-md">
              <u class="cursor-pointer">เข้าสู่ระบบด้วยบัญชีผู้ใช้อื่น</u>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- mobile -->
    <div class="absolute-center mobile-only q-pa-sm" style="width:100%; max-width:400px;">
      <div class="boxmobile boxmobiletop bg-blue-grey-10" align="center">
        <div class="text-white q-pt-sm">
          <img style="width:50px; height:30px" src="../assets/loginxs.png" alt />
          <span class="text-h5 q-px-sm">Winner@work</span>
        </div>
      </div>
      <div class="boxmobilebuttom bg-white">
        <div align="center">
          <div class="q-pt-md">
            <img
              style="width:90px; height:90px"
              :src="'../statics/avatar/' + SystemAccounts.avatar + '.png'"
            />
          </div>
          <div class="text-h5">{{SystemAccounts.name}}</div>
          <div class="q-pb-md q-px-sm">{{welcomeTitle[randomIndex]}}</div>

          <!-- Btn -->
          <div class="q-py-md">
            <q-btn class="btn" @click="loginBtn()" color="secondary" label="เข้าสู่ระบบ" />
          </div>

          <div class="q-pb-lg" @click="loginAgain()">
            <u class="cursor-pointer">เข้าสู่ระบบด้วยบัญชีผู้ใช้อื่น</u>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-bottom-right q-pr-sm text-grey-6">V. {{version}}</div>
  </div>
</template>



<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      version: "",
      myicon: "../assets/avatar/",
      isPwd: true,
      welcomeTitle: [
        "ไม่มีแคปชั่น มีแต่ใจที่คิดถึงเธอ",
        "เธอติดใจเพราะใจเราติดกัน",
        "น้ำลดตอผุด เน็ตหลุดกูตาย ",
        "ลูกอมต้องเป็นจูปาจุ๊ป รักนะจุ๊ปๆต้องเป็นเธอ",
        "ไอจีไม่รู้จะฟอลใคร แต่ใจ i อ่ะ for u",
        "ยิ้มเบาๆเขาว่าอ่อย ยิ้มให้บ่อยๆก็อ่อยเหมือนกัน",
        "คนที่ใช่…มาไม่บ่อย , คนที่คอย…มาไม่ถี่… คนที่รัก…มา ซักที !! , คนไม่รักดี…จะมาทำไม ?!!!!",
        "ก็ 'จีบ' อยู่ดีๆ สระ 'อี' ก็หายไป",
        "เธออาจไม่ใช่รักแรกพบ แต่ตอนจบขอให้เป็นเธอ",
        "พรหมลิขิต”อาจจะยังไม่รู้… 'พิกัด' ของเราสองคน",
        "คิดถึงเธอวันละครั้ง….ครั้งละ 24 ชั่วโมง",
        "ไม่อยากเป็น “คนรักเธอข้างเดียว”แต่อยากเป็น “คนรักเดียวข้างเธอ”",
        "ชอบให้เธออวบลงพุงนิดๆ เพราะชีวิตเธอจะมี”ชั้น”อยู่เสมอ",
        "ยอมเป็นแค่คนดีที่ไม่มีใคร ดีกว่าเป็นคนหลายใจที่ไม่มีอะไรดี",
        "“ความเงียบ” มันมักจะ จับมือกับ “ความเหงา”… มาเล่นงานเรา ในเวลา “ไม่ – มี – ใคร” !!",
        "“ความรัก” .. ทำให้ คน “ตาบอด” … บางครั้ง!? ก็ทำให้ “ขอบตาเขียว” !!…",
        "“รัก” เป็น “กริยา” . . แต่ “อกหัก” . . มันเป็น “กรรม.” !! . .",
        "ฉันไม่ใช่ “โบกี้ขบวนรถไฟ”  ไม่ต้องมา “สับราง”",
        "ฤดูร้อน,ฤดูฝน หรือฤดูหนาว พบเจอหมดแล้ว  แต่ทำไม ยังไม่เจอ “ฤดูรัก” ซักทีนะ ..",
        "คนไทยไม่ควรแยกสี เพราะมันเป็นหน้าที่ของ”โรงพิมพ์”",
        "ความรักคือการเดินทางไกล กว่าจะถึง “หัวใจ” มันต้องใช้ “เวลา”",
        "อาการ ‘น้อยใจ’ ไม่ใช่เรียกร้องความ’สนใจ’ แต่เรียกร้องความ’ใส่ใจ’",
        "ฝืนใช้คำว่า”เรา” ทั้งๆที่ในกระจกเงาสะท้อนคำว่า “ลา”",
        "คนที่ออกสื่อนะ “ตัวหลอก” คนที่ไม่บอกอ่ะ “ตัวจริง”",
        "เสียทองเท่าหัว..ไม่อยากเสียผัวต้องสวย",
        "ความหนาว..อาจทำให้ใครบางคนเหงา…แต่ความเหงาอาจจะทำให้ใครหลายคน หนาว!!",
        "เปลี่ยนลุคก็มีคนทัก .. เปลี่ยนรักก็มีคนทุกข์!!!",
        "ทํางานได้งาน…ทําเงินได้เงิน…เเต่ทําไมทําใจไม่เคยได้” ใจ”!!!"
      ],
      randomIndex: 0
    };
  },
  methods: {
    loginBtn() {
      this.$router.push("/vocabulary");
    },
    loadVersion() {
      db.collection("Version")
        .doc("backend")
        .get()
        .then(doc => {
          this.version = doc.data().appVersion;
        });
    },
    loginAgain() {
      this.$q.localStorage.set("systemAccountData", "");
      this.$router.push("/");
    }
  },
  mounted() {
    this.loadVersion();
    let welcomeNo = this.welcomeTitle.length;
    this.randomIndex = Math.floor(Math.random() * welcomeNo);
  }
};
</script>
<style scoped >
.boxmobilebuttom {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.boxmobiletop {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.boxmobile {
  height: 50px;
}
.boximg {
  width: 180px;
  height: 180px;
}
/*  background */
.bg {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/bg-dark.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.box-pos {
  position: relative;
  left: 10px;
}
.boxshadow {
  box-shadow: 1px 0px 10px rgb(56, 56, 56);
}
.btn {
  width: 120px;
}
.boxcard {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 360px;
}
.box {
  width: 720px;
}
.box-radius {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>