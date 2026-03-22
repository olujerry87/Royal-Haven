import PassportClient from './PassportClient';

export const metadata = {
    title: 'Digital Genesis | Royal Haven Passport',
    description: 'Verify authenticity and trace the lineage of your Royal Haven garment.',
};

export default function PassportPage({ params }) {
    // We pass the dynamic ID down to the client component to fetch/mock specific garment data
    return (
        <main>
            <PassportClient garmentId={params.id} />
        </main>
    );
}
