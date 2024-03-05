import { HiCheckBadge } from "react-icons/hi2";
import "@styles/mebershipcard.css"
import { useRouter } from "next/navigation";


const MembershipCard = ({ plan }) => {
    const router = useRouter();

    const handleCreateCheckoutSession=(planId)=>{
        router.push(`/member/checkout?planId=${planId}`)
    }

    return (
       plan.isActive && <div className="card">
            <div className="header">
                <span className="title">{plan.name}</span>
                <span className="price">{plan.price}₹</span>
            </div>
            <p className="desc">{plan.description}</p>
            <ul className="lists">
                {plan.features.map((feat, index) => <li className="list" key={index}>
                    <HiCheckBadge />
                    <span>{feat}</span>
                </li>)}

            </ul>
            <button type="button" className="action" onClick={()=> handleCreateCheckoutSession(plan.planId)}>Get Started</button>
        </div>
    )
}

export default MembershipCard





















// const handleCreateCheckoutSession=async(planId)=>{
//     console.log(planId)
//     const res = await fetch('/api/stripe/checkout-session',{
//         method : 'POST',
//         body : JSON.stringify(planId),
//         headers : {
//             "Content-Type" : 'application/json'
//         }
//     })

//     const checkoutSession = await res.json().then((value)=>{
//         return value.session;
//     });

//     const stripe = await loadStripe('pk_test_51OojDPSAF8Jk8mcaq475Tvi016VMyuhI3KND82nZL3rboSNKoudKtpnlFJAtoMjSmaN9RjY420mSV6GKxAMiDEup007Jow3Bz9');
//     console.log(stripe)
//     const result = await stripe.redirectToCheckout({
//         sessionId: checkoutSession.id,
//       });
//       if (result.error) {
//         alert(result.error.message);
//       }
// }