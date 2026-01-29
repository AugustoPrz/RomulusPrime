import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_USERS = [
  { email: "augustoperezf@gmail.com", nombre: "Augusto Perez" },
  { email: "contiabogados@gmail.com", nombre: "Conti Abogados" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results = [];

    for (const admin of ADMIN_USERS) {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === admin.email);

      if (existingUser) {
        results.push({
          email: admin.email,
          status: "already_exists",
          message: "Usuario ya existe",
        });
        continue;
      }

      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(admin.email, {
        redirectTo: `${req.headers.get("origin")}/setup-password`,
        data: {
          nombre: admin.nombre,
          is_admin: true,
        },
      });

      if (inviteError) {
        results.push({
          email: admin.email,
          status: "error",
          message: inviteError.message,
        });
        continue;
      }

      const { error: empleadoError } = await supabaseAdmin
        .from("empleados")
        .upsert({
          nombre: admin.nombre,
          rol: "Administrador",
          email: admin.email,
          activo: true,
          invite_status: "pending",
          invite_sent_at: new Date().toISOString(),
          auth_user_id: inviteData.user?.id,
        }, {
          onConflict: "email",
        });

      if (empleadoError) {
        console.error("Error creating empleado:", empleadoError);
      }

      results.push({
        email: admin.email,
        status: "invited",
        message: "Invitacion enviada",
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error setting up admins:", error);
    return new Response(
      JSON.stringify({ error: "Error al configurar administradores" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
