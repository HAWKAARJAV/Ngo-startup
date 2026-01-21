import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { isValidEmail, sanitizeString, isPositiveNumber } from '@/lib/security';

export async function POST(request) {
    try {
        const body = await request.json();

        const { role = 'NGO', email, password } = body; // Password is mocked for now

        // ===== INPUT VALIDATION =====
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Validate role is allowed
        const allowedRoles = ['NGO', 'CORPORATE'];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json({ error: 'Invalid role. Must be NGO or CORPORATE' }, { status: 400 });
        }

        // Normalize email (lowercase, trim)
        const normalizedEmail = email.toLowerCase().trim();

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
        }

        let newUser;

        if (role === 'CORPORATE') {
            const { companyName, industry, csrBudget, mandateAreas } = body;
            
            // Validate required corporate fields
            if (!companyName) {
                return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
            }

            // Sanitize inputs
            const sanitizedCompanyName = sanitizeString(companyName, 200);
            const sanitizedIndustry = sanitizeString(industry || '', 100);
            const sanitizedMandateAreas = sanitizeString(mandateAreas || '', 500);
            
            // Validate budget if provided
            const parsedBudget = csrBudget && isPositiveNumber(csrBudget) ? parseFloat(csrBudget) : 0;

            newUser = await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    name: sanitizedCompanyName,
                    role: 'CORPORATE',
                    corporateProfile: {
                        create: {
                            companyName: sanitizedCompanyName,
                            industry: sanitizedIndustry,
                            csrBudget: parsedBudget,
                            mandateAreas: sanitizedMandateAreas
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

            // Validate required NGO fields
            if (!orgName || !city || !state) {
                return NextResponse.json({ 
                    error: 'Required fields missing: orgName, city, and state are required' 
                }, { status: 400 });
            }

            // Validate ngoType if provided
            const allowedNgoTypes = ['TRUST', 'SOCIETY', 'SECTION_8'];
            const validNgoType = ngoType && allowedNgoTypes.includes(ngoType) ? ngoType : 'TRUST';

            // Sanitize all inputs
            const sanitizedData = {
                orgName: sanitizeString(orgName, 200),
                city: sanitizeString(city, 100),
                state: sanitizeString(state, 100),
                registrationNo: sanitizeString(registrationNo || '', 50),
                pincode: sanitizeString(pincode || '', 10),
                address: sanitizeString(address || '', 500),
                contactPerson: sanitizeString(contactPerson || '', 100),
                designation: sanitizeString(designation || '', 100),
                mobile: sanitizeString(mobile || '', 20),
                website: sanitizeString(website || '', 200),
                mission: sanitizeString(mission || '', 1000),
                pan: sanitizeString(pan || '', 20),
                darpanId: sanitizeString(darpanId || '', 50),
                csr1Number: sanitizeString(csr1Number || '', 50),
            };

            newUser = await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    name: sanitizedData.orgName,
                    role: 'NGO',
                    ngoProfile: {
                        create: {
                            orgName: sanitizedData.orgName,
                            ngoType: validNgoType,
                            registrationNo: sanitizedData.registrationNo || null,
                            city: sanitizedData.city,
                            state: sanitizedData.state,
                            pincode: sanitizedData.pincode || null,
                            address: sanitizedData.address || null,
                            contactPerson: sanitizedData.contactPerson || null,
                            designation: sanitizedData.designation || null,
                            mobile: sanitizedData.mobile || null,
                            website: sanitizedData.website || null,
                            mission: sanitizedData.mission || null,
                            pan: sanitizedData.pan || null,
                            darpanId: sanitizedData.darpanId || null,
                            csr1Number: sanitizedData.csr1Number || null,
                            is12AVerified: false,
                            trustScore: 50 // Start with neutral score till verified
                        }
                    }
                }
            });
        }

        // Don't expose internal ID in response
        return NextResponse.json({ 
            success: true, 
            user: {
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('[Auth] Registration error:', error);
        return NextResponse.json({ 
            error: 'Error creating account. Please try again.' 
        }, { status: 500 });
    }
}
