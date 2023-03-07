import styles from './FooterMain.module.css';

export default function FooterMain() {
  return (
    <div className={styles.footer}>
      <div className={styles.pageContentInner}>
        <div className={styles.gridContainer}>
          <div className={styles.gridColumn}>
            <div className={styles.list}>
              <div className={styles.title}>CUSTOMER SERVICE</div>
              <ul>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Track an Order</a>
                </li>
                <li>
                  <a href="#">Return an Item</a>
                </li>
                <li>
                  <a href="#">Return Policy</a>
                </li>
                <li>
                  <a href="#">Privacy & Security</a>
                </li>
                <li>
                  <a href="#">Feedback</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.gridColumn}>
            <div className={styles.list}>
              <div className={styles.title}>MY ACCOUNT</div>
              <ul>
                <li>
                  <a href="#">Login/Register</a>
                </li>
                <li>
                  <a href="#">Order History</a>
                </li>
                <li>
                  <a href="#">Returns History</a>
                </li>
                <li>
                  <a href="#">Address Book</a>
                </li>
                <li>
                  <a href="#">Wish Lists</a>
                </li>
                <li>
                  <a href="#">Email Notifications</a>
                </li>
                <li>
                  <a href="#">Subscriptions Orders</a>
                </li>
                <li>
                  <a href="#">Auto Notifications</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.gridColumn}>
            <div className={styles.list}>
              <div className={styles.title}>COMPANY INFORMATION</div>
              <ul>
                <li>
                  <a href="#">About Newegg</a>
                </li>
                <li>
                  <a href="#">Awards/Rankings</a>
                </li>
                <li>
                  <a href="#">Hours and Locations</a>
                </li>
                <li>
                  <a href="#">Press Inquiries</a>
                </li>
                <li>
                  <a href="#">Newegg Careers</a>
                </li>
                <li>
                  <a href="#">Newsroom</a>
                </li>
                <li>
                  <a href="#">Newegg Insider</a>
                </li>
                <li>
                  <a href="#">Calif. Transparency in Supply Chains Act</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.gridColumn}>
            <div className={styles.list}>
              <div className={styles.title}>TOOLS & RESOURCES</div>
              <ul>
                <li>
                  <a href="#">Sell on Newegg</a>
                </li>
                <li>
                  <a href="#">For Your Business</a>
                </li>
                <li>
                  <a href="#">Newegg Partner Services</a>
                </li>
                <li>
                  <a href="#">Become an Affiliate</a>
                </li>
                <li>
                  <a href="#">Newegg Creators</a>
                </li>
                <li>
                  <a href="#">Site Map</a>
                </li>
                <li>
                  <a href="#">Shop by Brand</a>
                </li>
                <li>
                  <a href="#">Rebates</a>
                </li>
                <li>
                  <a href="#">Mobile Apps</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.gridColumn}>
            <div className={styles.list}>
              <div className={styles.title}>SHOP OUR BRANDS</div>
              <ul>
                <li>
                  <a href="#">Newegg Business</a>
                </li>
                <li>
                  <a href="#">Newegg Global</a>
                </li>
                <li>
                  <a href="#">ABS</a>
                </li>
                <li>
                  <a href="#">Rosewill</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
