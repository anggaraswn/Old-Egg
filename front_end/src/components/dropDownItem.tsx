import styles from './DropDownItem.module.css';

export default function DropdownItem(props: any) {
  return (
    <li className={styles.dropdownItem}>
      <img src={props.image} alt="Icon" height={20} width={20} />
      <a onClick={props.click} href={`${props.link}`}>
        {props.text}
      </a>
    </li>
  );
}
