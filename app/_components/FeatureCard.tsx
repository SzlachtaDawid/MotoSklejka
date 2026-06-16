import Link from "next/link";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

const FeatureCard = ({ title, description, actionLabel, actionHref }: Props) => {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        {actionLabel && actionHref && (
          <div className="card-actions justify-end">
            <Link href={actionHref} className="btn btn-primary btn-sm">
              {actionLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
