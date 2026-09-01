<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { theme } = useData()
</script>

<template>
  <Layout>
    <template #nav-bar-title-before>
      <span class="josh-brand">
        <span class="brand-text">AI</span>
        <span class="brand-doodle" aria-hidden="true">
          <!-- top hand-drawn W doodle -->
          <svg class="doodle-top" width="13" height="10" viewBox="0 0 14 11" fill="none">
            <path d="M1.5 8 C2.2 4.5 3 2.5 4.5 5.5 C5.5 8 6.5 8.2 7.5 4.8 C8.5 2 9.5 2.5 10.5 5.8 C11.5 8 12.2 5.5 12.8 2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- bottom hand-drawn inverted chevron doodle -->
          <svg class="doodle-bottom" width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path d="M1.5 6 C3.2 3.2 4.2 1.5 5 1.5 C5.8 1.5 6.8 3.2 8.5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="brand-text">PM Guide</span>
      </span>
    </template>

    <template #home-hero-after>
      <div class="hero-clouds" aria-hidden="true">
        <svg class="hero-clouds-svg hero-clouds-back" width="5120" height="456" viewBox="0 0 5120 456" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="var(--cloud-500)" d="M2467 198C2478.93 198 2508.5 148.5 2692.3 167C2855.77 183.454 2890 275.92 2940.45 271C2978.5 267.29 3025.5 66.1073 3208.04 55.5002C3364.5 46.408 3407.37 123 3419.5 123.5C3431.63 124 3448.89 83.0002 3564.32 83.0002C3728 83.0002 3767.67 198.501 3779.08 198C3790.5 197.5 3808 45.0002 4044.68 45.0002C4238.5 45.0002 4245.32 120.5 4256.5 116.5C4267.69 112.5 4277 13.5002 4417.9 13.5002C4567 13.5002 4590.74 115.5 4608.5 116.5C4626.26 117.5 4640.5 13.5007 4795 13.5004C4946 13.5002 4954.43 76.5003 4970.51 76.5003C4986.6 76.5003 4983 8.5 5077 8.5C5147.13 8.5 5148.62 62.7657 5148.14 74.3437C5148.08 75.8075 5148 77.2344 5148 78.6994V360V361.5C5148 383.592 5130.09 401.5 5108 401.5H9C-13.0914 401.5 -31 383.592 -31 361.5V133.5V76.0021V76.0002C-31 75.9604 -30.9925 -7.80104e-05 24 0C103.747 0.000113126 132.617 67.9717 143.069 117.186C148.413 142.347 172.927 161.481 197.99 155.7L478.5 91C598.5 64.5 646 110.5 659 110.5C672 110.5 714 31 856 33.5C998 36 996.5 76 1008.5 73.5C1020.5 71 1014.28 28.0329 1174.5 31C1309.5 33.5 1298.5 110.5 1327.5 110.5C1366.31 110.5 1378.25 109.457 1388 110.5C1406.69 112.5 1429.5 27 1615 27C1743.74 27 1771.09 161.183 1855.16 167C1930.28 172.198 1914.5 85 2032.05 90.0002C2108.93 93.2702 2132.33 148 2146.16 148C2160 148 2184 81.6655 2318.08 102.5C2440.5 121.524 2455.07 198 2467 198Z"/>
          <path fill="var(--cloud-300)" d="M2617 234C2496.99 229.765 2429.72 276.108 2400.53 303.732C2388.43 315.177 2372.83 323.5 2356.18 323.5H2135.62C2111.05 323.5 2089.95 305.704 2082.79 282.198C2061.56 212.504 2001.53 78.3592 1852.75 71.0003C1691 63 1645 185 1622 186.5C1599 188 1587 88.5 1368.5 88.5C1211 88.5 1180 157.5 1158.4 161.5C1136.8 165.501 1074.33 111 931 129.5C787.671 148 789.676 214.5 770 214C750.324 213.5 736.5 129.5 535.029 142.5C416.863 150.125 382.163 211.07 373.669 260.166C368.141 292.123 343.421 323.5 310.99 323.5H280.024C249.079 323.5 225.052 295.503 224.331 264.567C222.732 195.98 200.305 92 79 92C17.4738 92 3.47982 128.37 0.653094 139.38C0.122368 141.447 0 143.571 0 145.705V398C0 412.36 11.6404 424 25.9998 424H5100C5127.61 424 5150 401.615 5150 374V365V181.851C5150 149.381 5119.54 125.514 5087.89 132.773C5054.67 140.392 5019.02 148.008 5011.31 147.5C4996.11 146.501 4966.41 99.9071 4859.43 95.5003C4731 90.2096 4684 213.5 4663 213.5H4531.84C4513.48 213.5 4496.63 203.435 4485.66 188.715C4451.8 143.286 4365.08 52.9127 4220.67 71.0003C4061 91.0002 4023.5 150.5 4006.5 150.5C3989.5 150.5 3925.6 96.5092 3797.5 100.5C3637 105.5 3599 235.5 3589 231.5C3563.12 221.148 3430.32 192.596 3405.38 180.145C3382.96 168.954 3354.61 161.5 3318.87 161.5C3175.43 161.5 3129.73 224 3116.87 224C3104 224 3073.62 179.5 2953.5 179.5C2782 179.5 2771.92 286 2756 284.5C2740.08 283 2721.1 237.674 2617 234Z"/>
        </svg>
        <svg class="hero-clouds-svg hero-clouds-front" width="5120" height="456" viewBox="0 0 5120 456" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="var(--cloud-paper)" d="M2641.4 401.5C2613.31 399.999 2525.75 198 2121.01 198C1862 198 1840 264.5 1806.88 259.5C1773.77 254.499 1723.34 129.991 1562.17 136C1401 142.009 1366.58 313.5 1339 321C1311.42 328.5 1279 226.5 1034.79 234.5C802.99 242.093 724.297 318.5 697 313C669.703 307.5 681 75.9996 430.496 32.4996C214.304 -5.042 99.7464 183.937 60.6394 266.475C51.4353 285.9 27.9703 295.392 8.5729 286.129C-15.3473 274.705 -43 292.144 -43 318.652V429.5C-43 443.859 -31.3592 455.5 -16.9999 455.5H5103C5127.3 455.5 5147 435.8 5147 411.5V232.89C5147 226.643 5146.46 220.404 5144.55 214.457C5136.92 190.729 5108.7 128.5 5022.5 128.5C4881 128.5 4935 253.704 4838.83 249C4808.16 247.499 4757.27 55.5004 4535 59C4312.73 62.4996 4283.98 270.5 4250.5 268.5C4217.02 266.5 4197 199 4037.27 189.5C3834.76 177.455 3790.86 285 3753.5 279C3716.14 273 3652.96 98.8238 3377.5 153.5C3156.46 197.374 3191.5 387.48 3139.82 376.5C3118.64 371.999 3078.5 339 2948.03 339C2894.2 339 2890.37 330.676 2837.19 339C2708.5 359.141 2669.5 403 2641.4 401.5Z"/>
        </svg>
      </div>
    </template>

    <template #layout-bottom>
      <footer class="josh-footer">
        <div class="footer-clouds" aria-hidden="true">
          <svg viewBox="0 0 5120 337" width="5120" height="250" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="var(--cloud-paper)" d="M2262 93C2122.5 82.5987 2116 21.5 2096.5 21.5C2077 21.5 2070.5 77.5238 1920.5 93C1794.5 106 1786 62 1771.5 63.5C1757 65 1687 155.5 1580 142C1473 128.5 1446.5 90 1435 93C1423.5 96 1448.03 199.005 1340 214C1181.5 236 1155.5 142 1144 142C1132.5 142 1105.5 269 946.5 236C787.5 203 799 115 784 114.5C769 114 732.5 162 544 158C382 154.562 352.5 81 341 84.5C329.5 88 358 269 168 326C-22 383 -75.5 180 -75.5 180V0.5H5189.5L5193.5 46C5193.5 46 5200 94 5069.5 100.5C4939 107 4923.5 21.5 4906.5 21.5C4889.5 21.5 4870 35 4835 93.5C4800 152 4765.5 169.5 4643.5 173.5C4521.5 177.5 4436.5 69 4425.5 76.5C4414.5 84 4413.5 212 4235 222C4056.5 232 4045.5 92 4033.5 89C4021.5 86 3968.5 169.5 3823.5 172.5C3678.5 175.5 3573.5 104 3562.5 106.5C3551.5 109 3553.5 167.5 3396 201C3238.5 234.5 3171.5 168.5 3161 172.5C3150.5 176.5 3164 273 3076.5 294.5C2975.99 319.197 2935 228 2920 225.5C2905 223 2862 276.955 2749 245C2671.4 223.057 2672.5 149 2660.5 151.5C2648.5 154 2622.5 181.04 2548.5 158C2425 119.548 2427.5 53.5 2412 51C2396.5 48.5 2376 101.5 2262 93Z"/>
          </svg>
        </div>
        <div class="footer-inner">
          <nav class="footer-nav" aria-label="页尾导航">
            <section class="footer-nav-group">
              <h2>知识体系</h2>
              <ul>
                <li><a href="/concepts/">概念学习</a></li>
                <li><a href="/concepts/ai-tech/">AI 技术基础</a></li>
                <li><a href="/concepts/product-foundations">产品基础知识</a></li>
                <li><a href="/concepts/product-methodology/">产品方法论</a></li>
                <li><a href="/concepts/safety-and-compliance">安全与合规</a></li>
              </ul>
            </section>

            <section class="footer-nav-group">
              <h2>实战与成长</h2>
              <ul>
                <li><a href="/practice/">产品实战</a></li>
                <li><a href="/roadmaps/">学习路线</a></li>
                <li><a href="/interview/">面试指南</a></li>
                <li><a href="/resources/">推荐阅读</a></li>
              </ul>
            </section>

            <section class="footer-nav-group">
              <h2>网站相关</h2>
              <ul>
                <li><a href="/about">关于本站</a></li>
                <li><a href="/sources/">来源索引</a></li>
                <li><a href="https://github.com/STRUGGLE1999/ai-pm-guide">GitHub 项目</a></li>
              </ul>
            </section>
          </nav>

          <div v-if="theme.footer" class="footer-meta">
            <p v-if="theme.footer.message" class="footer-message">{{ theme.footer.message }}</p>
            <p v-if="theme.footer.copyright" class="footer-copyright">{{ theme.footer.copyright }}</p>
          </div>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<style scoped>
.josh-brand {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--vp-font-family-base);
  font-weight: 800;
  font-size: 20px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  letter-spacing: -0.01em;
  user-select: none;
  transition: opacity 0.15s ease;
}

.josh-brand:hover {
  opacity: 0.88;
}

.brand-text {
  display: inline-block;
  color: var(--vp-c-brand-1);
}

.dark .brand-text {
  color: hsl(240deg 80% 75%);
}

.brand-doodle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  color: #4b5563;
  line-height: 1;
  position: relative;
  top: -1px;
}

.dark .brand-doodle {
  color: #9ca3af;
}

.doodle-top {
  display: block;
  margin-bottom: 2px;
}

.doodle-bottom {
  display: block;
}

.hero-clouds {
  position: absolute;
  z-index: 1;
  top: 80px;
  right: 0;
  left: 0;
  height: 456px;
  overflow: clip;
  line-height: 0;
  pointer-events: none;
  background: linear-gradient(var(--cloud-sky-from), var(--cloud-sky-to));
}

.hero-clouds-svg {
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 5120px;
  min-width: 5120px;
  max-width: none;
  height: 456px;
  transform: translate(-50%, 1px);
}

.hero-clouds-front {
  z-index: 1;
}

@media (max-width: 50rem) {
  .hero-clouds {
    top: calc(520px - (5rem + 50vw));
    height: calc(5rem + 50vw);
  }

  .hero-clouds-svg {
    --cloud-mobile-offset: calc(-50vw + 25rem);
    height: calc(5rem + 50vw);
    transform: translate(calc(-50% + var(--cloud-mobile-offset)), 1px);
  }
}

.josh-footer {
  width: 100%;
  margin-top: -1px;
  position: relative;
  min-height: 533px;
  padding: 250px 24px 40px;
  overflow: clip;
  color: var(--vp-c-text-1);
  background: linear-gradient(var(--cloud-sky-from), var(--cloud-sky-to));
}

.footer-clouds {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 250px;
  overflow: clip;
  line-height: 0;
  pointer-events: none;
}

.footer-clouds svg {
  display: block;
  width: 5120px;
  min-width: 5120px;
  max-width: none;
  height: 250px;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .josh-footer {
    min-height: 420px;
    padding-top: 250px;
  }

  .footer-clouds svg {
    transform: translate(100px, -1px);
  }
}

.footer-inner {
  position: relative;
  z-index: 1;
  max-width: 1152px;
  margin: 0 auto;
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 72px;
  width: 100%;
}

.footer-nav-group h2 {
  margin: 0 0 20px;
  color: #294e60;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: 0.08em;
}

.footer-nav-group ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-nav-group li + li {
  margin-top: 10px;
}

.footer-nav-group a {
  display: inline-block;
  color: var(--vp-c-text-1);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.65;
  text-decoration: none;
  transition: color 0.15s ease, transform 0.15s ease;
}

.footer-nav-group a:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

.footer-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 38px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.dark .footer-nav-group h2 {
  color: #afcfde;
}

.footer-message,
.footer-copyright {
  margin: 0;
}

@media (max-width: 768px) {
  .josh-footer {
    min-height: auto;
    padding-right: 24px;
    padding-bottom: 36px;
    padding-left: 24px;
  }

  .footer-nav {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-nav-group h2 {
    margin-bottom: 12px;
  }

  .footer-nav-group ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 20px;
  }

  .footer-nav-group li + li {
    margin-top: 0;
  }

  .footer-meta {
    margin-top: 32px;
  }
}
</style>
