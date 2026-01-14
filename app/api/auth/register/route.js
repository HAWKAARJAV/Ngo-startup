import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        const { role = 'NGO', email, password } = body; // Password is mocked for now

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
        }

        let newUser;

        if (role === 'CORPORATE') {
            const { companyName, industry, csrBudget, mandateAreas } = body;
            newUser = await prisma.user.create({
                data: {
                    email,
                    name: companyName,
                    role: 'CORPORATE',
                    corporateProfile: {
                        create: {
                            companyName,
                            industry,
                            csrBudget: parseFloat(csrBudget) || 0,
                            mandateAreas
                        }
                    }
                }
            });
        } else {
            // Default to NGO
            const {
                orgName,
                ngoType, // TRUST, SOCIETY, SECTION_8
                registrationNo,
                city,
                state,
                pincode,
                address,
                contactPerson,
                designation,
                mobile,
                website,
                mission,
                pan,
                darpanId,
                csr1Number,
            } = body;

            newUser = await prisma.user.create({
                data: {
                    email,
                    name: orgName,
                    role: 'NGO',
                    ngoProfile: {
                        create: {
                            orgName,
                            ngoType: ngoType || 'TRUST',
                            registrationNo,
                            city,
                            state,
                            pincode,
                            address,
                            contactPerson,
                            designation,
                            mobile,
                            website,
                            mission,
                            pan,
                            darpanId,
                            csr1Number,
                            is12AVerified: false,
                            trustScore: 50 // Start with neutral score till verified
                        }
                    }
                }
            });
        }

        return NextResponse.json({ success: true, user: newUser });

    } catch (error) {
        console.error('Registration error', error);
        return NextResponse.json({ error: 'Error creating account. ' + error.message }, { status: 500 });
    }
}
