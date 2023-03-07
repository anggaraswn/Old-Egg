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
                  <a href="https://kb.newegg.com/">Help Center</a>
                </li>
                <li>
                  <a href="#">Track an Order</a>
                </li>
                <li>
                  <a href="#">Return an Item</a>
                </li>
                <li>
                  <a href="https://www.newegg.com/promotions/nepro/22-0073/index.html?cm_sp=cs_menu-_-return_policy">
                    Return Policy
                  </a>
                </li>
                <li>
                  <a href="https://kb.newegg.com/knowledge-base/privacy-policy-newegg/">
                    Privacy & Security
                  </a>
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
                  <a href="/login">Login/Register</a>
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
                  <a href="/wishlist">Wish Lists</a>
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
                  <a href="https://www.newegg.com/corporate/about">
                    About Newegg
                  </a>
                </li>
                <li>
                  <a href="https://www.newegg.com/corporate/homepage">
                    Investor Relations
                  </a>
                </li>
                <li>
                  <a href="https://www.newegg.com/d/Info/Awards">
                    Awards/Rankings
                  </a>
                </li>
                <li>
                  <a href="https://www.newegg.com/d/Info/OfficeHours">
                    Hours and Locations
                  </a>
                </li>
                <li>
                  <a href="https://www.newegg.com/d/Info/PressInquires?cm_sp=press_inquires_footer">
                    Press Inquiries
                  </a>
                </li>
                <li>
                  <a href="https://www.newegg.com/careers">Newegg Careers</a>
                </li>
                <li>
                  <a href="https://www.newegg.com/corporate/newsroom">
                    Newsroom
                  </a>
                </li>
                <li>
                  <a href="https://www.newegg.com/insider/">Newegg Insider</a>
                </li>
                <li>
                  <a href="https://kb.newegg.com/knowledge-base/ca-transparency-in-supply-chains-act/">
                    Calif. Transparency in Supply Chains Act
                  </a>
                </li>
                <li>
                  <a href="https://www.cigna.com/legal/compliance/machine-readable-files">
                    Cigna MRF
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.gridColumn}>
            <div className={styles.list}>
              <div className={styles.title}>TOOLS & RESOURCES</div>
              <ul>
                <li>
                  <a href="https://www.newegg.com/sellers/?cm_sp=sell_on_newegg_footer">
                    Sell on Newegg
                  </a>
                </li>
                <li>
                  <a href="https://www.neweggbusiness.com/why-business-account?cm_sp=for_your_business_footer">
                    For Your Business
                  </a>
                </li>
                <li>
                  <a href="https://partner.newegg.com/?cm_sp=newegg_partner_services_footer">
                    Newegg Partner Services
                  </a>
                </li>
                <li>
                  <a href="https://www.newegg.com/creators?cm_sp=Homepage-bottom-_-affiliates">
                    Become an Affiliate
                  </a>
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
