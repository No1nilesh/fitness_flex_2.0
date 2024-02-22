import { HiCheckBadge } from "react-icons/hi2";
import "@styles/mebershipcard.css"
const MembershipCard = () => {
  return (
    <div className="card">
    <div className="header">
                            <span className="title">Beginner</span>
                            <span className="price">Free</span>
                        </div>
                        <p className="desc">Etiam ac convallis enim, eget euismod dolor.</p>
                        <ul className="lists">
                            <li className="list">
                            <HiCheckBadge />
                                <span>Aenean quis</span>
                            </li>
                            <li className="list">
                            <HiCheckBadge />
                                <span>Morbi semper</span>
                            </li>
                            <li className="list">
                            <HiCheckBadge />
                                <span>Tristique enim nec</span>
                            </li>
                        </ul>
                        <button type="button" className="action">Get Started</button>
                    </div>
  )
}

export default MembershipCard
